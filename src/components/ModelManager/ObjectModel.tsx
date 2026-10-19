import { useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'

const ObjectModel = () => {
    const { scene } = useGLTF( `${import.meta.env.BASE_URL}models/base_object.glb`);

    const onClick = (e:ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        console.log('바닥 클릭')
    }

    return (
        <>
            <primitive object={scene} onClick={onClick} />
        </>
    )
}

export default ObjectModel;