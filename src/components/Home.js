import React from 'react';

const ProjectIntroduction = () => {
  return (
    <div style={{ position: 'relative', height:"92vh",display: 'flex'}}>
      <video
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit:"cover"}}
        src="./Assests/Fire(1080p).mp4"
        autoPlay
        muted
        loop
      ></video>
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'left', color: 'white', paddingTop: '20vh' }}>
        <h1 className='mx-5' style={{ fontSize: '2rem', marginBottom: '1rem' }}>WildFires</h1>
        <p className='mx-5' style={{ fontSize: '1.5rem' }}>Using AI to provide accurate wildfire information to affected communities and fire authorities</p>
      </div>
    </div>
  );
};

export default ProjectIntroduction;
