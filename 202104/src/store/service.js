export const types = {
  SERVER_ERROR: 'SERVER_ERROR'
  // EXAMPLE_NOT_AUTH: 'EXAMPLE_NOT_AUTH',
  // EXAMPLE_NOT_FOUND: 'EXAMPLE_NOT_FOUND'
}

export const example = () => {
  return {
    request: {
      url: '/json/skit.json',
      method: 'get'
    },
    success: (res) => {
      const example = res.data.example || {}
      return { data: example, error: null }
    },
    error: (err) => {
      const result = {
        data: {
          example: ''
        },
        error: {
          name: types.SERVER_ERROR
        }
      }
      // handle error
      if (err.status === 401) {
        // result.error = { name: types.EXAMPLE_NOT_AUTH }
      } else if (err.status === 404) {
        // result.error = { name: types.EXAMPLE_NOT_FOUND }
      }
      return result
    }
  }
}
