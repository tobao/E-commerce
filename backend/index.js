const port = 4000;
// const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());
//Database connection with MongoDB
mongoose.connect("mongodb+srv://tobaodev:30101997%40Bocap@clustere.d5qynch.mongodb.net/e-commerce")

// API Creation

app.get("/",(req,res)=>{
  res.send("Express App is Running")
})

// Image Storage Engine
const storage = multer.diskStorage({
  destination:'./upload/images',
  filename:(req,file,cb)=>{
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

/* Note:
  multer.diskStorage: Thiết lập nơi lưu trữ và cách đặt tên file cho các file được tải lên.
  //  -destination: Đường dẫn tới thư mục lưu trữ file. Ở đây là ./upload/images.
  //  -filename: Hàm xác định tên file sẽ được lưu trữ.
  //    +req: Đối tượng yêu cầu.   
  //    +file: Đối tượng file chứa thông tin về file được tải lên.
  //    +cb: Callback function để trả về tên file mới.
  //    +Tên file mới: Kết hợp fieldname của file, thời gian hiện tại và đuôi mở rộng của file gốc (path.extname(file.originalname)).
*/

const upload = multer({storage:storage})
/* multer({ storage: storage }) ==> Khởi tạo multer với cấu hình lưu trữ đã thiết lập ở bước trước.
multer là middleware để xử lý việc tải lên file. storage xác định nơi và cách các file sẽ được lưu trữ.
*/

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))
/* Sử dụng middleware - các hàm có quyền truy cập vào đối tượng yêu cầu (request object), đối tượng phản hồi (response object), và hàm middleware kế tiếp trong chuỗi xử lý yêu cầu/response của ứng dụng 
Có hai middleware chính được sử dụng ở đây : express.static và multer
Và express.static để phục vụ các file tĩnh trong thư mục upload/images tại đường dẫn /images. */

app.post("/upload",upload.single('product'),(req,res)=>{
  res.json({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
  })
})
/* Note:
app.post("/upload", upload.single('product'), (req, res) => { ... }): Tạo endpoint POST tại đường dẫn /upload để xử lý việc upload hình ảnh.
  upload.single('product'): Middleware của multer để xử lý một file đơn lẻ được gửi với tên field là product.
  req.file: Đối tượng chứa thông tin về file đã tải lên.
  res.json: Gửi phản hồi JSON về cho client.
    success: 1: Chỉ báo rằng việc upload thành công.
    image_url: Đường dẫn URL tới file hình ảnh vừa tải lên.
*/

//Schema for  Creating Products
const Product = mongoose.model("Product",{
  id:{
    type:Number,
    require: true,
  },
  name:{
    type:String,
    require:true,
  },
  image:{
    type:String,
    require:true,
  },
  categoty:{
    type:String,
    require:true,
  },
  new_price:{
    type:Number,
    require: true,
  },
  old_price:{
    type:Number,
    require: true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
  avilable:{
   type: Boolean,
   default: true,
  }
})

app.post('/addproduct',async (req,res)=>{
  let products = await Product.find({});
  let id;
  if(products.length>0)
    {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id+1;
    }
    else{
      id=1;
    }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    categoty: req.body.categoty,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  })
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success:true,
    name:req.body.name,
  })
})

//Creating API for deleting Products
app.post('/removeproduct',async(req,res)=>{
  await Product.findOneAndDelete({id:req.body.id});
  console.log("Removed!");
  res.json({
    success:true,
    name:req.body.name
  })
})

//Creating API for getting all products
app.get('/allproducts',async(req,res)=>{
  let products = await Product.find({});
  console.log("All Product Fetched");
  res.send(products);
})


app.listen(port,(error)=>{
  if(!error){
    console.log("Server Runing on Port: "+port)
  }
  else{
    console.log("Error: "+error);
  }
})