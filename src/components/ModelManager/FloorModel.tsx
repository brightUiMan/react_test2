import { useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import * as THREE from 'three'

interface FloorProps {
  setTarget: React.Dispatch<React.SetStateAction<THREE.Vector3 | null>>
}

const FloorModel = ({setTarget} : FloorProps) => {
    const { scene } = useGLTF( `${import.meta.env.BASE_URL}models/base_floor.glb`);
    // const { scene } = useGLTF( `${import.meta.env.BASE_URL}models/test/low_poly_city_game-ready.glb`);
    // const { scene } = useGLTF( `${import.meta.env.BASE_URL}models/testfloor.glb`);
    const isDragging = useRef<boolean>(false)
    const startPoint = useRef<{x:number , y: number}>({ x: 0, y: 0 })
    // const onClick = (e:ThreeEvent<MouseEvent>) => {
    //     e.stopPropagation()
    //     isDragging.current = false
    //     // setTarget(e.point.clone())
    // }

   const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()

    isDragging.current = false

    startPoint.current = {
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
    }
}

const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const dx = e.nativeEvent.clientX - startPoint.current.x
    const dy = e.nativeEvent.clientY - startPoint.current.y

    if (Math.hypot(dx, dy) > 5) {
        isDragging.current = true
    }
}

const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()

    if (isDragging.current) {
        console.log('드래그')
    } else {
        setTarget(e.point.clone())
    }
}



    return (
        <>
            <RigidBody type="fixed" colliders="trimesh" position={[0, 0, 0]}>
                <primitive object={scene} 
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                />
            </RigidBody>
        </>
    )
}

export default FloorModel;