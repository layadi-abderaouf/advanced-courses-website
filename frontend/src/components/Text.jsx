import React from 'react'
import { useSelector } from 'react-redux'
import { getlang } from '../storage/user'


function Text({en,ar}) {
    const lang = useSelector(getlang)
  return (
    <>
    {lang === "EN" ? en : ar}
    </>
  )
}

export default Text