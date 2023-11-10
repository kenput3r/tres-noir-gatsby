import React from "react"
import styled from "styled-components"
import type { Pagination } from "../../types/yotpo"

const Component = styled.div``
type Props = {
  pagination: Pagination
}
const ReviewPagination = ({ pagination }: Props) => {
  const { page, per_page, total } = pagination
  const range = total <= 5 ? total : 5
  const pages = Array.from(Array(range), (_, x) => x + 1)
  console.log("pages", pages)
  return <Component></Component>
}

export default ReviewPagination
