import React from 'react';
 
import {mount} from './components/freelog-i18n-management.js'

export default function() {
  console.log(mount, 12222)
  return (
    <div className="w-100x h-100x">
      <div id="freelog-i18n"></div>
      {setTimeout(()=>{mount()}, 400)}
     </div>
  );
}
