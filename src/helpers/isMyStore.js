export default function isMyStore(req, dataBD) {
  if (dataBD?.userId !== req.user.id) {
    const error = new Error("No estas autorizado para ver esa informacion");
    error.statusCode = 400;
    throw error;
  }

  if(dataBD.storeId !== req.store.id){
    const error = new Error("No estas autorizado para ver esa informacion");
    error.statusCode = 400;
    throw error;
  }
}
