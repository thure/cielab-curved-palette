export function rotateAboutPoint(
  obj,
  point,
  axis,
  theta,
  pointIsWorld = false
) {
  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position) // compensate for world coordinate
  }

  rotatePoint(obj.position, point, axis, theta)

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position) // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta) // rotate the OBJECT
}

export function rotatePoint(vector, point, axis, theta) {
  vector.sub(point) // remove the offset
  vector.applyAxisAngle(axis, theta) // rotate the POSITION
  vector.add(point) // re-add the offset
}

export const ck = 3 / 8
export const lk = 1
