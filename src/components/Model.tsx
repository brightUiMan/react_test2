import { useGLTF } from '@react-three/drei'

const Model = () => {
    const { scene: base } = useGLTF( `${import.meta.env.BASE_URL}models/base_test2.glb`)
    return (
        <>
<primitive object={base}  />
        </>
    )
}

export default Model;