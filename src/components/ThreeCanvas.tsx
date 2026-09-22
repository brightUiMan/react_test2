import { Canvas} from "@react-three/fiber";
import Light from "./Light";
import Model from "./Model";
import { OrbitControls } from "@react-three/drei";

const ThreeCanvas = () => {
    return <>
        <Canvas  camera={{ position: [0, 0, 30], rotation:[0, 0, 0],  fov: 60, near: 0.1, far: 1000 }} >
            <Light />
            {/* <mesh position={[0, 0, -5]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red"/>
            </mesh> */}
            <OrbitControls />
            <Model />
        
         </Canvas>
    </>
}

export default ThreeCanvas;