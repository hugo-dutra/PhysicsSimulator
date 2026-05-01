import * as THREE from 'three'

export const originAxisLegendItems = [
  {
    id: 'X',
    color: '#F43F5E',
    colorValue: 0xf43f5e,
    label: 'horizontal',
  },
  {
    id: 'Y',
    color: '#A3E635',
    colorValue: 0xa3e635,
    label: 'profundidade',
  },
  {
    id: 'Z',
    color: '#38BDF8',
    colorValue: 0x38bdf8,
    label: 'vertical',
  },
] as const

export type OriginAxesGridBounds = {
  centerX: number
  centerY: number
  size: number
  z: number
}

export function getGridLowerLeftOrigin({
  centerX,
  centerY,
  size,
  z,
}: OriginAxesGridBounds) {
  return new THREE.Vector3(centerX - size / 2, centerY - size / 2, z)
}

export function getOriginAxesLength(gridSize: number) {
  return Math.min(1.35, Math.max(0.45, gridSize * 0.13))
}

export function createOriginAxesMarker({
  axisLength,
  origin,
}: {
  axisLength: number
  origin: THREE.Vector3
}) {
  const group = new THREE.Group()
  const originDot = new THREE.Mesh(
    new THREE.SphereGeometry(axisLength * 0.06, 12, 8),
    new THREE.MeshBasicMaterial({
      color: 0xe6e8ec,
      depthTest: false,
      depthWrite: false,
      opacity: 0.58,
      transparent: true,
    }),
  )

  group.name = 'grid-origin-axes'
  group.renderOrder = 8
  originDot.position.copy(origin)
  group.add(originDot)

  const axes = [
    {
      color: originAxisLegendItems[0].colorValue,
      direction: new THREE.Vector3(1, 0, 0),
    },
    {
      color: originAxisLegendItems[1].colorValue,
      direction: new THREE.Vector3(0, 1, 0),
    },
    {
      color: originAxisLegendItems[2].colorValue,
      direction: new THREE.Vector3(0, 0, 1),
    },
  ]

  axes.forEach((axis) => {
    const arrow = new THREE.ArrowHelper(
      axis.direction,
      origin,
      axisLength,
      axis.color,
      axisLength * 0.2,
      axisLength * 0.08,
    )

    arrow.renderOrder = 9
    setTransparentArrowMaterial(arrow)
    group.add(arrow)
  })

  return group
}

function setTransparentArrowMaterial(arrow: THREE.ArrowHelper) {
  const materials = [
    arrow.line.material,
    arrow.cone.material,
  ].flat() as THREE.Material[]

  materials.forEach((material) => {
    material.depthTest = false
    material.depthWrite = false
    material.opacity = 0.72
    material.transparent = true
  })
}
