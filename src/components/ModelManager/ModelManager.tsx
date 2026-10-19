import { useState } from "react";
import CharacterModel from "./CharacterManager/CharacterModel";
import FloorModel from "./FloorModel"
import ObjectModel from "./ObjectModel"
import * as THREE from 'three'


const ModelManager = () => {
    const [target, setTarget] = useState<THREE.Vector3 | null>(null)
    return (
        <>
            <CharacterModel target={target}/>
            <ObjectModel />
            <FloorModel setTarget={setTarget}/>
        </>
    )
}

export default ModelManager;