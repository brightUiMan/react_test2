import { Canvas} from "@react-three/fiber";
import Light from "./Light";
const ThreeCanvas = () => {
    return <>
        <Canvas  camera={{ position: [0, 10, 0], rotation:[-Math.PI/3, 0, 0],  fov: 60, near: 0.1, far: 1000 }} >
            <Light />
            <mesh position={[0, 0, -5]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red"/>
            </mesh>

         </Canvas>
    </>
}

export default ThreeCanvas;