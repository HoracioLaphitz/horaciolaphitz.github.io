import{j as e}from"../chunks/jsx-runtime.D3GSbgeI.js";import{r as o}from"../chunks/index.yGrMsBkE.js";import"../chunks/index.yBjzXJbu.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),m=(...s)=>s.filter((t,r,c)=>!!t&&t.trim()!==""&&c.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var f={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=o.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:c,className:n="",children:a,iconNode:p,...u},k)=>o.createElement("svg",{ref:k,...f,width:t,height:t,stroke:s,strokeWidth:c?Number(r)*24/Number(t):r,className:m("lucide",n),...u},[...p.map(([y,j])=>o.createElement(y,j)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=(s,t)=>{const r=o.forwardRef(({className:c,...n},a)=>o.createElement(b,{ref:a,iconNode:t,className:m(`lucide-${g(s)}`,c),...n}));return r.displayName=`${s}`,r};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=i("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=i("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=i("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=i("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]),w=s=>{switch(s){case"notebook":return e.jsx(d,{className:"w-5 h-5"});case"pdf":return e.jsx(x,{className:"w-5 h-5"});case"dataset":return e.jsx(h,{className:"w-5 h-5"})}},l=({resource:s,type:t})=>e.jsxs("a",{href:s.path,download:!0,className:"flex items-center gap-3 p-4 rounded-lg border border-skin-border bg-skin-surface hover:bg-skin-surface-hover transition-colors group",children:[e.jsx("div",{className:"flex-shrink-0 text-skin-accent",children:w(t)}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"font-medium text-skin-primary group-hover:text-skin-accent transition-colors truncate",children:s.name}),s.description&&e.jsx("p",{className:"text-sm text-skin-muted mt-1",children:s.description})]}),e.jsx(v,{className:"w-4 h-4 text-skin-muted group-hover:text-skin-accent transition-colors flex-shrink-0"})]});function R({notebooks:s,pdfs:t,datasets:r}){return s?.length||t?.length||r?.length?e.jsxs("div",{className:"mt-12 p-6 rounded-2xl bg-skin-surface border border-skin-border",children:[e.jsx("h2",{className:"text-2xl font-bold text-skin-primary mb-6",children:"Recursos Descargables"}),e.jsxs("div",{className:"space-y-6",children:[s&&s.length>0&&e.jsxs("div",{children:[e.jsxs("h3",{className:"text-lg font-semibold text-skin-primary mb-3 flex items-center gap-2",children:[e.jsx(d,{className:"w-5 h-5 text-skin-accent"}),"Notebooks Jupyter"]}),e.jsx("div",{className:"space-y-2",children:s.map((n,a)=>e.jsx(l,{resource:n,type:"notebook"},a))})]}),t&&t.length>0&&e.jsxs("div",{children:[e.jsxs("h3",{className:"text-lg font-semibold text-skin-primary mb-3 flex items-center gap-2",children:[e.jsx(x,{className:"w-5 h-5 text-skin-accent"}),"Documentos PDF"]}),e.jsx("div",{className:"space-y-2",children:t.map((n,a)=>e.jsx(l,{resource:n,type:"pdf"},a))})]}),r&&r.length>0&&e.jsxs("div",{children:[e.jsxs("h3",{className:"text-lg font-semibold text-skin-primary mb-3 flex items-center gap-2",children:[e.jsx(h,{className:"w-5 h-5 text-skin-accent"}),"Datasets"]}),e.jsx("div",{className:"space-y-2",children:r.map((n,a)=>e.jsx(l,{resource:n,type:"dataset"},a))})]})]})]}):null}export{R as ResourceDownload};
