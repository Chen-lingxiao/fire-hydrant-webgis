import axios from 'axios'

// GeoServer基础URL
const baseURL = 'http://localhost:8085/geoserver'
// 图层固定信息（统一维护，避免硬编码）
const LAYER_INFO = {
  workspace: 'fire_hydrant',
  layerName: 'fire_hydrants',
  namespace: 'http://localhost:8085/geoserver/fire_hydrant', // 工作区命名空间（需与GeoServer一致）
  geomField: 'geom', // 几何字段名
}
// 从GeoServer加载要素数据
export const loadFeatures = async (): Promise<GeoJSON.FeatureCollection> => {
  const url = `${baseURL}/wfs`
  // WFS GetFeature请求参数
  const params = {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typeName: 'fire_hydrant:fire_hydrants',
    outputFormat: 'application/json',
    srsName: 'urn:ogc:def:crs:EPSG::4326',
  }
  try {
    const response = await axios.get(url, { params })
    // 遍历循环，分割id fire_hydrants.1 --> 1
    response.data.features.forEach((feature: GeoJSON.Feature) => {
      if (feature.id) {
        const idParts = String(feature.id).split('.')
        feature.id = idParts.length > 1 ? idParts[1] : feature.id
      }
    })
    return response.data
  } catch (error) {
    console.error('加载要素失败:', error)
    throw error
  }
}

/**
 * 通用要素编辑函数（统一处理Insert/Update/Delete操作）
 * @param features 要素数据（根据操作类型提供不同字段）
 * @param operation 操作类型：insert/update/delete
 */
export const editFeatures = async (
  features: GeoJSON.Feature[],
  operation: 'insert' | 'update' | 'delete'
) => {
  if (features.length === 0) {
    console.log('没有需要保存的要素')
    return
  }
  const url = `${baseURL}/wfs`
  let TransactionFragments = ''
  switch (operation) {
    case 'insert':
      // 构建新增操作的XML片段
      TransactionFragments = features
        .map((feature) => {
          if (
            feature.geometry?.type !== 'MultiPoint' ||
            !feature.geometry.coordinates
          ) {
            console.warn('跳过无效的新增要素:', feature)
            return ''
          }
          const coords = feature.geometry.coordinates[0]
          const pos = `${coords[0]} ${coords[1]}`
          return `
          <wfs:Insert>
            <${LAYER_INFO.workspace}:${LAYER_INFO.layerName}>
              <${LAYER_INFO.workspace}:${LAYER_INFO.geomField}>
                <gml:MultiPoint srsName="EPSG:4326">
                  <gml:pointMembers>
                    <gml:Point><gml:pos>${pos}</gml:pos></gml:Point>
                  </gml:pointMembers>
                </gml:MultiPoint>
              </${LAYER_INFO.workspace}:${LAYER_INFO.geomField}>
              <${LAYER_INFO.workspace}:currentStatus>${feature.properties?.currentStatus}</${LAYER_INFO.workspace}:currentStatus>
              <${LAYER_INFO.workspace}:currentPressure>${feature.properties?.currentPressure}</${LAYER_INFO.workspace}:currentPressure>
              <${LAYER_INFO.workspace}:managementUnit>${feature.properties?.managementUnit}</${LAYER_INFO.workspace}:managementUnit>
              <${LAYER_INFO.workspace}:installationDate>${feature.properties?.installationDate}</${LAYER_INFO.workspace}:installationDate>
              <${LAYER_INFO.workspace}:managementUserNo>${feature.properties?.managementUserNo}</${LAYER_INFO.workspace}:managementUserNo>
            </${LAYER_INFO.workspace}:${LAYER_INFO.layerName}>
          </wfs:Insert>
        `
        })
        .join('')
      break
    case 'update':
      // 构建更新操作的XML片段
      TransactionFragments = features
        .map((feature) => {
          if (
            feature.geometry?.type !== 'Point' ||
            !feature.id ||
            !feature.properties
          ) {
            console.warn('跳过无效的更新要素:', feature)
            return ''
          }
          const id = feature.id
          return `
          <wfs:Update typeName="${LAYER_INFO.workspace}:${LAYER_INFO.layerName}">
            <wfs:Property>
              <wfs:Name>currentStatus</wfs:Name>
              <wfs:Value>${feature.properties?.currentStatus}</wfs:Value>
            </wfs:Property>
            <wfs:Property>
              <wfs:Name>currentPressure</wfs:Name>
              <wfs:Value>${feature.properties?.currentPressure}</wfs:Value>
            </wfs:Property>
            <wfs:Property>
              <wfs:Name>managementUnit</wfs:Name>
              <wfs:Value>${feature.properties?.managementUnit}</wfs:Value>
            </wfs:Property>
            <wfs:Property>
              <wfs:Name>installationDate</wfs:Name>
              <wfs:Value>${feature.properties?.installationDate}</wfs:Value>
            </wfs:Property>
            <wfs:Property>
              <wfs:Name>managementUserNo</wfs:Name>
              <wfs:Value>${feature.properties?.managementUserNo}</wfs:Value>
            </wfs:Property>
            <!-- 定位要更新的要素：通过 ID 过滤 -->
            <ogc:Filter>
              <ogc:FeatureId fid="fire_hydrants.${id}"/>
            </ogc:Filter>
          </wfs:Update>
          `
        })
        .join('')
      break
    case 'delete':
      // 构建更新操作的XML片段
      TransactionFragments = features
        .map((feature) => {
          if (
            feature.geometry?.type !== 'Point' ||
            !feature.id ||
            !feature.properties
          ) {
            console.warn('跳过无效的更新要素:', feature)
            return ''
          }
          const id = feature.id
          return `
          <wfs:Delete typeName="${LAYER_INFO.workspace}:${LAYER_INFO.layerName}">
            <ogc:Filter>
                <ogc:FeatureId fid="fire_hydrants.${id}" />
            </ogc:Filter>
          </wfs:Delete>
          `
        })
        .join('')
      break
  }
  if (!TransactionFragments) {
    console.log('没有有效的要素需要保存')
    return
  }
  // 构建WFS-T事务请求XML
  const wfsTransaction = `
    <wfs:Transaction service="WFS" version="1.1.0"
      xmlns:wfs="http://www.opengis.net/wfs"
      xmlns:gml="http://www.opengis.net/gml"
      xmlns:${LAYER_INFO.workspace}="${LAYER_INFO.namespace}"
      xmlns:ogc="http://www.opengis.net/ogc">
      ${TransactionFragments}
    </wfs:Transaction>
  `
  console.log('WFS-T Transaction请求XML:', wfsTransaction)
  try {
    const response = await axios.post(url, wfsTransaction, {
      headers: {
        'Content-Type': 'text/xml', // 必须设置Content-Type为text/xml
        Accept: 'application/xml', // 响应数据类型为XML
      },
    })

    console.log(`WFS-T${operation}响应:`, response.data)
    return response.data
  } catch (error) {
    console.error('保存要素失败:', error)
  }
}
// export const saveFeatures = async (features: GeoJSON.Feature[]) => {
//   const url = `${baseURL}/wfs`
//   // 筛选新增要素 即id使用了temp_临时前缀
//   const newFeatures = features.filter((f) => {
//     return f.id?.toString().startsWith('temp_')
//   })
//   console.log('需要保存的新要素:', newFeatures)
//   // 如果没有需要保存的新要素，则直接返回
//   if (newFeatures.length === 0) {
//     console.log('没有需要保存的新要素')
//     return
//   }
//   let insertFragments = ''

//   for (const feature of newFeatures) {
//     // 检查要素几何类型和坐标
//     if (
//       feature.geometry?.type !== 'MultiPoint' ||
//       !feature.geometry.coordinates
//     ) {
//       console.warn('跳过无效的要素:', feature)
//       continue
//     }

//     const coords = feature.geometry.coordinates[0]
//     const pos = `${coords[0]} ${coords[1]}`
//     // 为每个要素构建插入片段
//     insertFragments += `
//       <wfs:Insert>
//         <fire_hydrant:fire_hydrants>
//           <fire_hydrant:geom>
//             <gml:MultiPoint srsName="EPSG:4326">
//               <gml:pointMembers>
//                 <gml:Point>
//                   <gml:pos>${pos}</gml:pos>
//                 </gml:Point>
//               </gml:pointMembers>
//             </gml:MultiPoint>
//           </fire_hydrant:geom>
//           <!-- 添加其他属性 -->
//           <fire_hydrant:currentstatus>${feature.properties?.currentstatus}</fire_hydrant:currentstatus>
//           <fire_hydrant:currentpressure>${feature.properties?.currentpressure}</fire_hydrant:currentpressure>
//           <fire_hydrant:ManagementUnit>${feature.properties?.ManagementUnit}</fire_hydrant:ManagementUnit>
//           <fire_hydrant:InstallationDate>${feature.properties?.InstallationDate}</fire_hydrant:InstallationDate>
//           <fire_hydrant:ManagementUserNo>${feature.properties?.ManagementUserNo}</fire_hydrant:ManagementUserNo>
//         </fire_hydrant:fire_hydrants>
//       </wfs:Insert>
//     `
//   }
//   console.log('WFS-T Insert Fragments:', insertFragments)
//   // 如果没有有效的插入片段，则返回
//   if (!insertFragments) {
//     console.log('没有有效的要素需要插入')
//     return
//   }
//   // 构建WFS-T事务请求XML
//   const wfsTransaction = `
//     <wfs:Transaction service="WFS" version="1.1.0"
//       xmlns:wfs="http://www.opengis.net/wfs"
//       xmlns:gml="http://www.opengis.net/gml"
//       xmlns:fire_hydrant="http://localhost:8085/geoserver/fire_hydrant"
//       xmlns:ogc="http://www.opengis.net/ogc">
//       ${insertFragments}
//     </wfs:Transaction>
//   `
//   console.log('WFS-T Transaction请求XML:', wfsTransaction)

//   try {
//     const response = await axios.post(url, wfsTransaction, {
//       headers: {
//         'Content-Type': 'text/xml', // 必须设置Content-Type为text/xml
//         Accept: 'application/xml', // 响应数据类型为XML
//       },
//     })

//     console.log('WFS-T Response:', response.data)
//     return response.data
//   } catch (error) {
//     console.error('保存要素失败:', error)
//     throw error
//   }
// }
