import { useGLTF } from '@react-three/drei'

const Model = () => {
    const { scene: base } = useGLTF('/models/base.glb')
    return (
        <>
<primitive object={base}  />
        </>
    )
}

export default Model;