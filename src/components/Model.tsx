import { useGLTF } from '@react-three/drei'

const Model = () => {
    const { scene: base } = useGLTF( `${import.meta.env.BASE_URL}models/test/bus.glb`)
    return (
        <>
<primitive object={base}  />
        </>
    )
}

export default Model;