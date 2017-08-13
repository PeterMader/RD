export default `
.rd-wrapper {
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, .3);
}
.rd-dialog {
  background-color: #EEEEEE;
  padding: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.rd-dialog.active {
  background-color: white;
  pointer-events: auto;
}
`;
