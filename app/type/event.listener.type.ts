/*
 * @author kaysaith
 * @date 2020/10/29 10:56
 */

export enum ListenerType {
  Click = "click",
  DoubleClick = 'dbclick',
  Input = "input",
  Focus = "focus",
  Blur = "blur",
  Scroll = "scroll",
  Wheel = "wheel",
  ContextMenu = "contextmenu",
  Mousemove = "mousemove",
  Mouseover = "mouseover",
  Mouseleave = "mouseleave",
  Mouseout = "mouseout",
  Mousedown = "mousedown",
  Mouseup = "mouseup",
  DOMNodeRemoved = "DOMNodeRemoved",
  DOMNodeInserted = "DOMNodeInserted",
  Animationend = "animationend",
  AnimationStart = "animationstart",
  VisibilityChange = "visibilitychange",
  BeforeUnload = "beforeunload",
  Resize = "resize",
}