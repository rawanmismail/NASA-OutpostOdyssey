export function movementVector(x, y, yaw) {
  const length = Math.hypot(x, y);
  if (!length) return {x: 0, z: 0, amount: 0};
  const amount = Math.min(1, length);
  // Forward is +Z in the character rig; screen-right is forward cross world-up.
  return {x: (-Math.cos(yaw)*x + Math.sin(yaw)*y)/length*amount,
    z: (Math.sin(yaw)*x + Math.cos(yaw)*y)/length*amount, amount};
}

export function followCameraPose(position, yaw, pitch = .12, rover = false) {
  const distance = rover ? 9.2 : 6.3;
  const shoulder = rover ? .8 : .55;
  return {
    eye: {x: position.x-Math.sin(yaw)*distance-Math.cos(yaw)*shoulder,
      y: position.y+(rover?3.6:2.9)+Math.sin(pitch)*4.5,
      z: position.z-Math.cos(yaw)*distance+Math.sin(yaw)*shoulder},
    look: {x: position.x+Math.sin(yaw)*4,
      y: position.y+(rover?1.7:1.65)-Math.sin(pitch)*3,
      z: position.z+Math.cos(yaw)*4}
  };
}

export function consoleLayout(width, height) {
  const portrait = width/height < .85;
  const compact = !portrait && height < 500;
  const pixels = portrait ? {width: 720, height: 1040} : compact ? {width: 960, height: 440} : {width: 1040, height: 700};
  const scale=.0075, w=pixels.width*scale, h=pixels.height*scale;
  const usableWidth=width<760?.94:.85, usableHeight=height<500?.67:.73;
  const distance=Math.max(w/(2*Math.tan(Math.PI/6)*(width/height)*usableWidth),h/(2*Math.tan(Math.PI/6)*usableHeight));
  return {...pixels,scale,distance,portrait,compact};
}

export function joystickVector(dx,dy,radius=43) {
  const d=Math.hypot(dx,dy),scale=d>radius?radius/d:1;
  return {x:dx*scale/radius,y:-dy*scale/radius,px:dx*scale,py:dy*scale};
}
