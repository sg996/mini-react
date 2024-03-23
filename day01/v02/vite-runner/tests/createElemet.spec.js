import React from '../core/React'
import { it, describe, expect } from 'vitest'

describe('createElement', () => {
  it('should return vDom element', () => {
    const el = React.createElement('div', { id: 'app' }, 'hello')

    // expect(el).toEqual({
    //   type: 'div',
    //   props: {
    //     id: 'app',
    //     children: [
    //       {
    //         type: 'TEXT_NODE',
    //         props: {
    //           nodeValue: 'hello',
    //           children: []
    //         }
    //       }
    //     ]
    //   }
    // })
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello",
              },
              "type": "TEXT_NODE",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `)
  })
})
