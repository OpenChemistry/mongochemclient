import { post, put } from '../'

export function create(parentId, parentType, name, size, mimeType='application/octet-stream') {
  return post('file', null, {
    params: {
      parentId,
      parentType,
      name,
      size,
      mimeType,
    }
  })
  .then(response => response.data );
}

export function update(id, size) {
  return put(`file/${id}/content`, {},  {
    params: {
      size,
    }
  })
  .then(response => response.data )
}

export function content(id, size) {

  return put(`file/${id}/content`, null,  {
    params: {
      size,
    }
  })
  .then(response => response.data );
}

export function chunk(uploadId, offset, data, config) {
  return post('file/chunk', data,  {
    ...config,
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    params: {
      uploadId,
      offset,
    }
  })
  .then(response => response.data )
}
