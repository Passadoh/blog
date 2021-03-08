import React, {useContext, useState} from 'react'
import PortableText from './portable-text'
import InfoIcon from './icons/info.svg'
import mq from '../lib/media'
import {getTheme, EASE_IN_OUT_TRANSITION} from '../theme/theme'
import ThemeContext from '../theme/ThemeContext'

const Note = ({mark, children}) => {
  const [touched, setTouched] = useState(false)
  const {theme} = useContext(ThemeContext)
  const {background, color} = getTheme(theme)

  const toggleTouched = () => setTouched(prev => !prev)
  return (
    <span className={`note ${touched ? 'note--touched' : ''}`} onTouchStart={toggleTouched} css={{
      borderBottom: '1px dashed #D9BF65',
      transition: `border ${EASE_IN_OUT_TRANSITION}`,
      cursor: 'help',
      '& a': {
        cursor: 'pointer'
      },
      '&:hover, .note--touched': {
        borderBottom: '1px solid #D9BF65'
      },
      '&:hover .note__text, &.note--touched .note__text': {
        border: '1px dashed #D9BF65',
        borderRadius: '2px',
        [mq('xl')]: {
          border: 'unset',
          opacity: '1',
          visibility: 'visible'
        }
      },
      [mq('xl')]: {
        position: 'relative'
      }
    }}>
      {children}
      <span css={{
        color: color,
        position: 'relative',
        width: '16px',
        height: '100%',
        display: 'inline-block',
        '& svg': {
          position: 'absolute',
          top: '-2.2rem'
        }
      }}>
        <InfoIcon/>
      </span>
      <span className="note__text" css={{
        color: color,
        position: 'absolute',
        left: '700px',
        fontSize: '1.2rem',
        lineHeight: '2.1rem',
        width: '100%',
        maxWidth: '220px',
        padding: '11px',
        border: '1px dashed transparent',
        transition: `border ${EASE_IN_OUT_TRANSITION}`,
        [mq('xl')]: {
          position: 'fixed',
          color: background,
          opacity: '0',
          visibility: 'hidden',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(1, 1, 1, 0.9)',
          borderRadius: '8px',
          maxWidth: '360px',
          transition: `opacity ${EASE_IN_OUT_TRANSITION}`
        }
      }}>
        <span css={{
          '& span': {
            display: 'inline'
          }
        }}>
          <InfoIcon/>{' '}
          <PortableText blocks={mark.content}/>
        </span>
      </span>
    </span>
  )
}

export default Note