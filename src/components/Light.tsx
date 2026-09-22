const Light = () => {
    return (
        <>
            <ambientLight intensity={0.8} />
        <directionalLight 
            
            position={[-30, 90, 60]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0005} // 그림자가 깨지거나 줄무늬 생기는 것 방지
        >
            {/* args: [left, right, top, bottom, near, far] 도시 전체가 들어가도록 넉넉하게! */}
            <orthographicCamera attach="shadow-camera" args={[-100, 100, 100, -100, 0.5, 500]} />
        </directionalLight>
        <directionalLight
        position={[100, 0, -70]}
        intensity={0.5}
        >

        </directionalLight>
        </>
    )
}

export default Light;