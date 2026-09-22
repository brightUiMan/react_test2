import { Canvas} from "@react-three/fiber";
const ThreeCanvas = () => {
    return <>
        <Canvas frameloop={"always" } camera={{ position: [0, 0, 0], rotation:[0, 0, 0],  fov: 60, near: 0.1, far: 1000 }} 

         shadows >
            <mesh position={[0, 0, -5]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red"/>
          </mesh>

         </Canvas>
    </>
}

export default ThreeCanvas;