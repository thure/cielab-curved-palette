/**
 * Simple matrix (and vector) multiplication
 * Warning: No error handling for incompatible dimensions!
 * @author Lea Verou 2020 MIT License
 */

// [v-wishow]: Adjusted to export a TypeScript module. Retrieved on 24 May 2021
// from https://drafts.csswg.org/css-color-4/multiply-matrices.js

// A is m x n. B is n x p. product is m x p.
export default function multiplyMatrices(A, B) {
  let m = A.length

  if (!Array.isArray(A[0])) {
    // A is vector, convert to [[a, b, c, ...]]
    A = [A]
  }

  if (!Array.isArray(B[0])) {
    // B is vector, convert to [[a], [b], [c], ...]]
    B = B.map((x) => [x])
  }

  let p = B[0].length
  let B_cols = B[0].map((_, i) => B.map((x) => x[i])) // transpose B
  let product = A.map((row) =>
    B_cols.map((col) => {
      if (!Array.isArray(row)) {
        return col.reduce((a, c) => a + c * row, 0)
      }

      return row.reduce((a, c, i) => a + c * (col[i] || 0), 0)
    })
  )

  if (m === 1) {
    product = product[0] // Avoid [[a, b, c, ...]]
  }

  if (p === 1) {
    return product.map((x) => x[0]) // Avoid [[a], [b], [c], ...]]
  }

  return product
}
