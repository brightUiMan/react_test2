import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier} from "@react-three/rapier";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

type CharacterModelProps = { target: THREE.Vector3 | null; };

const CharacterModel = ({ target }: CharacterModelProps) => {
  const { scene, animations } = useGLTF( `${import.meta.env.BASE_URL}models/cartoon_network_fusionfall-billy.glb` );
  const { actions, names } = useAnimations( animations, scene );
  const { world } = useRapier();
  const character = useRef<RapierRigidBody>(null!);
  const collider = useRef<any>(null);
  const controller = useRef<any>(null);
  const verticalVelocity = useRef(0);
  const shiftState = useRef<boolean>(false)
  const charAniState = useRef<string>("stand2");
  const {camera} = useThree()
  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3());
  const orbit = useRef<any>(null!)
const lastCharacterPosition = useRef(new THREE.Vector3());
const cameraInitialized = useRef(false);
  const changeAnim = useCallback((next: string) => {
    if (charAniState.current === next && actions[next]?.isRunning() ) return
   
    actions[charAniState.current]?.fadeOut(0.2)
    actions[next]?.reset().fadeIn(0.2).play()
    charAniState.current = next
  }, [actions])


  useEffect(() => {
    const characterController = world.createCharacterController(0.01);

    // 턱 올라가기
    characterController.enableAutostep(
      0.5, // 최대 턱 높이
      0.3, // 턱 위에 올라설 수 있는 최소 너비
      true
    );

    // 낮은 곳으로 내려갈 때 바닥에 붙기
    characterController.enableSnapToGround(0.5);
    controller.current = characterController;

    //shift 키 감지 
    const KeyDown = (e:KeyboardEvent) => {
      if(e.key === "Shift"){
        console.log('33535')
        shiftState.current = true;
      }

    }
    const KeyUp = (e:KeyboardEvent) => {
      if(shiftState.current){
        shiftState.current = false;
       
      }
    }

    window.addEventListener("keydown", KeyDown)
    window.addEventListener("keyup", KeyUp)


    return () => {
      world.removeCharacterController(characterController);
      controller.current = null;
      window.removeEventListener("keydown", KeyDown)
      window.removeEventListener("keyup", KeyUp)
    };

    
   
    
  }, [world]);

  useEffect(() => {
    actions["stand1"]?.play();

    return () => {
      actions["stand1"]?.stop();
    };
  }, [actions, names]);

  useFrame((state, delta) => {
      
    

    if ( !character.current || !collider.current || !controller.current || !orbit.current) return;
    const current = character.current.translation();

    // 1. 이동 방향 계산
    let direction = new THREE.Vector3();

    if (target) {
      direction.set( target.x - current.x, 0, target.z - current.z );
    }

    const distance = direction.length();

    // =====================================================
    // 2. 목표 위치에 가까우면 수평 이동 중지
    // =====================================================

    let movementX = 0;
    let movementZ = 0;

    if (target && distance > 0.1) {
      direction.normalize();

      const speed = shiftState.current? 10: 3;

      const movement = Math.min(
        speed * delta,
        distance
      );

      movementX = direction.x * movement;
      movementZ = direction.z * movement;

      // 캐릭터가 이동 방향을 바라보도록
      const angle = Math.atan2(
        direction.x,
        direction.z
      );

      scene.rotation.y = angle;

      // 걷기 애니메이션
      !shiftState.current? changeAnim("walk") : changeAnim("run")
    } else {
      changeAnim("stand1")
    }


    // 3. 중력
    const gravity = -9.8;
    verticalVelocity.current += gravity * delta;
    verticalVelocity.current = Math.max( verticalVelocity.current, -20 );  // 너무 빠르게 떨어지는 것 방지

    const desiredMovement = {
      x: movementX,
      y: verticalVelocity.current * delta,
      z: movementZ,
    };

    
    controller.current.computeColliderMovement( // controller에게 collider의 이동량(desireMovement)가 실제로 얼만큼 이동가능한지 계산을 맡겨놓음
      collider.current,
      desiredMovement
    );

    const computedMovement = controller.current.computedMovement(); // controller에게 맡겨놓은 실제이동량 계산의 결과값을 가져옴

    // =====================================================
    // 6. 실제 캐릭터 이동
    // =====================================================

    character.current.setNextKinematicTranslation({
      x: current.x + computedMovement.x,
      y: current.y + computedMovement.y,
      z: current.z + computedMovement.z,
    });

    // =====================================================
    // 7. 바닥에 닿았으면 중력 속도 초기화
    // =====================================================

    const grounded = controller.current.computedGrounded();

    if (grounded && verticalVelocity.current < 0) {
      verticalVelocity.current = 0;
    }


    // 8. OrbitControls 카메라 추적

    // 최초 1회 카메라 초기 위치 설정
    if (!cameraInitialized.current) {
      camera.position.set(
        current.x,
        current.y + 3,
        current.z - 6
      );

      orbit.current.target.set(
        current.x,
        current.y + 1.5,
        current.z
      );

      lastCharacterPosition.current.set(
        current.x,
        current.y,
        current.z
      );

      orbit.current.update();
      cameraInitialized.current = true;
    }

    // 캐릭터가 이동한 거리 계산
    const dx = current.x - lastCharacterPosition.current.x;
    const dy = current.y - lastCharacterPosition.current.y;
    const dz = current.z - lastCharacterPosition.current.z;

    // 카메라와 회전 중심을 같은 거리만큼 이동
    camera.position.x += dx;
    camera.position.y += dy;
    camera.position.z += dz;

    orbit.current.target.x += dx;
    orbit.current.target.y += dy;
    orbit.current.target.z += dz;

    // 다음 프레임을 위한 위치 저장
    lastCharacterPosition.current.set(
      current.x,
      current.y,
      current.z
    );


  });

  return (
    <>
      <RigidBody
      ref={character}
      type="kinematicPosition"
      colliders={false}
      enabledRotations={[false, false, false]}
      position={[0, 1, 0]}
    >
      <primitive object={scene} />

      <CapsuleCollider
        ref={collider}
        args={[0.6, 0.35]}
        // args={[0.4, 0.5]}
        position={[0, 0.91, 0.05]}
      />
     
    </RigidBody>
    <OrbitControls ref={orbit}/>
    </>
    

  );
};

export default CharacterModel;