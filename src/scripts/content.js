/*
 * Copyright (c) 2014 os0x
 * Copyright (c) 2014-2018 mono
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function content (window, id) {
  let open = window.open
  let port = chrome.runtime.connect(id)
  window.open = (url, name) => {
    if (url === void 0) return open(url, name)
    port.postMessage({ message: 'openInTab', url: url })
    return true
  }
  document.addEventListener('click', (evt) => {
    if (evt.target.href && evt.target.target === '_blank') {
      evt.preventDefault()
      window.open(evt.target.href, '_blank')
    }
  }, false)
}

let fn = `(${content.toString()})(this, '${chrome.runtime.id}');`
let script = document.createElement('script')
script.appendChild(document.createTextNode(fn))
document.body.appendChild(script)
