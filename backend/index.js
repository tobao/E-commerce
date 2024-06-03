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
const { error, log } = require("console");

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
  category: {
    type: String,
    required: true,
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
    category: req.body.category,
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

//Shema creating for User Model
const Users = mongoose.model('Users',{
  name:{
    type:String,
  },
  email:{
    type:String,
    unique:true, //unique để đảm bảo không có hai người dùng có cùng email.
  },
  password:{
    type:String,
  },
  cartData:{
    type:Object,
  },
  date:{
    type:Date,
    default:Date.now,
  }
})

//Create Endpont for registering the user
app.post('/signup', async(req,res)=>{
  let check = await Users.findOne({email:req.body.email})
  if(check){
    return res.status(400).json({success:false,errors:"Existing user found with same email address"})
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i]=0;
  }
  const user = new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
  })
  await user.save();

  const data = {
    user:{
      id:user.id
    }
  }

  const token = jwt.sign(data,'secret_ecom');
  res.json({success:true,token})

})

/*Note
app.post('/signup', async (req, res) => { ... }): Tạo một endpoint POST tại /signup để đăng ký người dùng.
  let check = await Users.findOne({ email: req.body.email }): Tìm kiếm người dùng trong cơ sở dữ liệu với email được cung cấp.
    await: Đảm bảo rằng quá trình tìm kiếm hoàn thành trước khi tiếp tục.
    Users.findOne({ email: req.body.email }): Truy vấn cơ sở dữ liệu để tìm người dùng với email được cung cấp.
  if (check): Kiểm tra nếu một người dùng với email đó đã tồn tại.
  return res.status(400).json({ success: false, errors: "Existing user found with same email address" }): Nếu người dùng tồn tại, trả về mã trạng thái 400 và thông báo lỗi.
------------------------------------
Tạo giỏ hàng mặc định cho người dùng:
  let cart = {};: Khởi tạo một đối tượng trống để lưu dữ liệu giỏ hàng.
  for (let i = 0; i < 300; i++) { cart[i] = 0; }: Tạo một giỏ hàng mặc định với 300 mục, mỗi mục có giá trị là 0.
-----------------------------------
Tạo và lưu người dùng mới:
  const user = new Users({ ... }): Tạo một đối tượng người dùng mới với dữ liệu từ yêu cầu (req.body).
    name: req.body.username: Tên người dùng.
    email: req.body.email: Email người dùng.
    password: req.body.password: Mật khẩu người dùng.
    cartData: cart: Giỏ hàng mặc định được tạo ở trên.
  await user.save();: Lưu người dùng mới vào cơ sở dữ liệu.
--------------------------------------  
Tạo và trả về token JWT:
  const data = { user: { id: user.id } }: Tạo dữ liệu để mã hóa trong token, bao gồm ID của người dùng.
  const token = jwt.sign(data, 'secret_ecom');: Tạo token JWT với dữ liệu người dùng và secret key 'secret_ecom'.
  res.json({ success: true, token }): Trả về phản hồi JSON với token được tạo và trạng thái thành công.

Tóm lại:
  1.Tạo model Users: Định nghĩa schema cho người dùng với các thuộc tính name, email, password, cartData và date.
  2.Tạo endpoint /signup: Endpoint để đăng ký người dùng mới.
    Kiểm tra xem email đã tồn tại chưa.
    Tạo giỏ hàng mặc định.
    Tạo người dùng mới và lưu vào cơ sở dữ liệu.
    Tạo token JWT và trả về cho client.

Ngoài ra có thể tham khảo code cải thiện sử dụng bcrypt để mã hóa mật khẩu khi đăng kí người dùng ở BackendNote.txt 
*/

//Creating endpoint for user login
app.post('/login',async (req,res)=>{
  let user = await Users.findOne({email:req.body.email});
  if(user){
    const passCompare = req.body.password === user.password;
    if(passCompare){
      const data = {
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data,'secret_ecom');
      res.json({success:true,token})
    }
    else{
      res.json({success:false,error:"Wrong Password"});
    }
  }
  else{
    res.json({success:false, error:"Wrong Email ID"});
  }
})
/*
1.Định nghĩa endpoint POST /login:
  app.post('/login', async (req, res) => { ... }): Định nghĩa một endpoint POST tại /login để xử lý yêu cầu đăng nhập người dùng.
  async (req, res): Định nghĩa hàm bất đồng bộ để có thể sử dụng await bên trong.

2.Tìm kiếm người dùng theo email:
  let user = await Users.findOne({ email: req.body.email });:
    await: Đợi kết quả từ truy vấn cơ sở dữ liệu.
    Users.findOne({ email: req.body.email }): Tìm người dùng có email khớp với email trong yêu cầu (req.body.email).

3.Kiểm tra sự tồn tại của người dùng:
  if (user): Kiểm tra nếu người dùng tồn tại.

4. So sánh mật khẩu:
  const passCompare = req.body.password === user.password;: So sánh mật khẩu từ yêu cầu (req.body.password) với mật khẩu lưu trữ trong cơ sở dữ liệu (user.password).
  Cài thiện code: Không nên lưu mật khẩu dưới dạng plain text. Thay vào đó, sử dụng thư viện như bcrypt để hash mật khẩu trước khi lưu vào cơ sở dữ liệu.
    const passCompare = await bcrypt.compare(req.body.password, user.password);

5.Nếu mật khẩu khớp:
  if (passCompare): Kiểm tra nếu mật khẩu khớp.
  Tạo dữ liệu token:
    const data = { user: { id: user.id } };: Tạo đối tượng data chứa ID người dùng.
  Tạo token JWT:
    const token = jwt.sign(data, 'secret_ecom');: Tạo token JWT với dữ liệu người dùng và secret key 'secret_ecom'.
  Trả về phản hồi thành công:
  res.json({ success: true, token });: Trả về phản hồi JSON với trạng thái thành công và token.

6.Nếu mật khẩu không khớp:
  else: Nếu mật khẩu không khớp.
  Trả về thông báo lỗi mật khẩu sai:
    res.json({ success: false, error: "Wrong Password" });: Trả về phản hồi JSON với trạng thái thất bại và thông báo lỗi mật khẩu sai.

7.Nếu người dùng không tồn tại:
  else: Nếu người dùng không tồn tại.
  Trả về thông báo lỗi email sai:
    res.json({ success: false, error: "Wrong Email ID" });: Trả về phản hồi JSON với trạng thái thất bại và thông báo lỗi email sai.

Tổng kết:
  Endpoint POST /login: Xử lý yêu cầu đăng nhập.
  Tìm kiếm người dùng theo email: Kiểm tra nếu email tồn tại trong cơ sở dữ liệu.
  So sánh mật khẩu: Kiểm tra nếu mật khẩu khớp với mật khẩu trong cơ sở dữ liệu.
  Tạo token JWT: Nếu email và mật khẩu hợp lệ, tạo token JWT và trả về cho client.
  Trả về thông báo lỗi: Nếu email hoặc mật khẩu không hợp lệ, trả về thông báo lỗi tương ứng.

Code cải thiện:
app.post('/login', async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Wrong Email ID" });
    }
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (!passCompare) {
      return res.status(400).json({ success: false, error: "Wrong Password" });
    }
    const data = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});
*/

// Creating endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("Newcollection Fetched");
  res.send(newcollection);
})

/* Note
*Lưu ý:Giới hạn số lượng sản phẩm trả về từ cơ sở dữ liệu: Nếu số lượng sản phẩm trong cơ sở dữ liệu rất lớn, việc lấy tất cả sản phẩm có thể gây ra vấn đề về hiệu suất. Thay vào đó, có thể giới hạn số lượng sản phẩm trả về bằng cách sử dụng .limit() hoặc các phương pháp khác.
Vì vậy trong ShopContext ta đã giới hạn sản phẩm là 300+1 SP

Định nghĩa endpoint GET /newcollections:
  app.get('/newcollections', async (req, res) => { ... }): Định nghĩa một endpoint GET tại /newcollections để xử lý yêu cầu lấy dữ liệu bộ sưu tập mới.
  async (req, res): Định nghĩa hàm bất đồng bộ để có thể sử dụng await bên trong.

Lấy tất cả sản phẩm từ cơ sở dữ liệu:
  let products = await Product.find({});:
    await: Đợi kết quả từ truy vấn cơ sở dữ liệu.
    Product.find({}): Truy vấn tất cả các sản phẩm từ cơ sở dữ liệu.

Tạo bộ sưu tập mới:
  let newcollection = products.slice(1).slice(-8);:
    products.slice(1): Lấy tất cả các sản phẩm từ vị trí thứ 1 (bỏ qua sản phẩm đầu tiên).
    slice(-8): Lấy 8 sản phẩm cuối cùng từ mảng sản phẩm đã cắt ở bước trước.

  ==>Kết quả là, newcollection chứa 8 sản phẩm cuối cùng từ danh sách sản phẩm sau khi bỏ qua sản phẩm đầu tiên.

Ghi log thông báo:
  console.log("Newcollection Fetched");: Ghi log thông báo rằng bộ sưu tập mới đã được lấy thành công.

Trả về dữ liệu bộ sưu tập mới cho client:
  res.send(newcollection);: Trả về mảng newcollection cho client.     

Code cải thiện:
app.get('/newcollections', async (req, res) => {
  try {
    // Lấy tất cả sản phẩm từ cơ sở dữ liệu (có thể giới hạn số lượng nếu cần)
    let products = await Product.find({});

    // Tạo bộ sưu tập mới (bỏ qua sản phẩm đầu tiên và lấy 8 sản phẩm cuối cùng)
    let newcollection = products.slice(1).slice(-8);

    console.log("Newcollection Fetched");

    // Trả về bộ sưu tập mới cho client
    res.send(newcollection);
  } catch (error) {
    console.error("Error fetching new collection:", error);
    res.status(500).send("Server Error");
  }
});
*/

//Creating endpoint for popular in women seletion
app.get('/popularinwomen',async(req,res)=>{
  let products = await Product.find({category:"women"});
  let popular_in_women = products.slice(0,4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
})

/*
1. app.get('/popularinwomen', async(req, res) => {
  Mô tả: Định nghĩa một endpoint GET tại đường dẫn /popularinwomen.
  Ý nghĩa: Khi có một yêu cầu GET đến đường dẫn này, hàm không đồng bộ (async) sẽ được gọi để xử lý yêu cầu.

2.let products = await Product.find({ category: "women" });
  Mô tả: Tìm kiếm tất cả các sản phẩm (Product) có thuộc tính category là "women".
  Ý nghĩa: Sử dụng hàm find của Mongoose để lấy tất cả các sản phẩm thuộc danh mục "women" từ cơ sở dữ liệu.
  Lưu ý: Sử dụng await để chờ cho kết quả tìm kiếm được trả về trước khi tiếp tục thực thi các dòng mã tiếp theo.

3.let popular_in_women = products.slice(0, 4);
  Mô tả: Lấy ra 4 sản phẩm đầu tiên từ mảng products.
  Ý nghĩa: Giả sử các sản phẩm đầu tiên trong mảng là các sản phẩm phổ biến nhất, chúng ta sử dụng phương thức slice để chọn ra 4 sản phẩm này.

4.console.log("Popular in women fetched");
  Mô tả: Ghi log một thông báo vào console.
  Ý nghĩa: Cho biết rằng các sản phẩm phổ biến trong danh mục "women" đã được truy xuất thành công.

5.res.send(popular_in_women);
  Mô tả: Gửi mảng popular_in_women làm phản hồi cho yêu cầu GET.
  Ý nghĩa: Trả về danh sách 4 sản phẩm phổ biến trong danh mục "women" cho client.

Cải thiện code:
app.get('/popularinwomen', async(req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
  } catch (error) {
    console.error("Error fetching popular in women products:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
*/
//Creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
  const token = req.header('auth-token');
  if(!token){
    res.status(401).send({error:"Please authenticate using valid token"});
  }
  else{
    try {
      const data = jwt.verify(token,'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({error:"Please authenticate using a valid token"})
    }
  }
}

//Creating endpoint for adding products in cartData
app.post('/addtocart',fetchUser,async(req,res)=>{
  // console.log(req.body, req.user);
  console.log("Added ",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId] +=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
  res.status(200).send({ message: "Product added to cart successfully" });
});

/*
1.Khởi tạo Middleware fetchUser: const fetchUser = (req, res, next) => {}
  fetchUser là một middleware được tạo ra để xác thực người dùng.
  Middleware là một hàm có quyền truy cập vào đối tượng yêu cầu (req), đối tượng phản hồi (res), và hàm tiếp theo (next) trong chuỗi yêu cầu-đáp ứng của ứng dụng.

2.Lấy token từ header yêu cầu: const token = req.header('auth-token');
  req.header('auth-token') lấy giá trị của header auth-token từ yêu cầu HTTP.
  Token này được sử dụng để xác thực người dùng.

3.Kiểm tra xem token có tồn tại không:
  if (!token) {
  return res.status(401).send({ error: "Authentication token missing" });
  }
  ==>Nếu không có token, trả về mã trạng thái 401 (Unauthorized) và thông báo lỗi "Authentication token missing".
  return để dừng thực hiện tiếp tục các dòng mã sau đó.

4.Xác thực token:
  try {
    const data = jwt.verify(token, 'secret_ecom');
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid authentication token" });
  }

  jwt.verify(token, 'secret_ecom') dùng để xác thực token với khóa bí mật 'secret_ecom'.
  Nếu token hợp lệ, thông tin người dùng được lưu vào req.user.
  next() được gọi để tiếp tục chuỗi middleware hoặc route handler tiếp theo.
  Nếu token không hợp lệ hoặc có lỗi trong quá trình xác thực, trả về mã trạng thái 401 (Unauthorized) và thông báo lỗi "Invalid authentication token".

5.Tạo endpoint để thêm sản phẩm vào cartData: app.post('/addtocart',....});
  app.post('/addtocart', fetchUser, async (req, res) => {...}) định nghĩa một route POST tại đường dẫn /addtocart.
  Middleware fetchUser được sử dụng trước khi route handler để xác thực người dùng.
  async (req, res) cho phép sử dụng cú pháp async/await trong route handler.
  console.log(req.body, req.user) in ra nội dung của yêu cầu và thông tin người dùng đã xác thực.
  Đoạn mã giả định sẽ xử lý req.body và req.user để thêm sản phẩm vào cartData.
  Sau khi xử lý, gửi phản hồi lại cho client với mã trạng thái 200 (OK) và thông báo "Product added to cart successfully".
*/
//Creating endpoint to remove product cartData
app.post('/removefromcart',fetchUser,async(req,res)=>{
  console.log("Removed ",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId])
  userData.cartData[req.body.itemId] -=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
  res.status(200).send({ message: "Product removed to cart successfully" });
})

//Creating endpoint to get cartData
app.post('/getcart',fetchUser,async(req,res)=>{
  console.log("GetCart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})



app.listen(port,(error)=>{
  if(!error){
    console.log("Server Runing on Port: "+port)
  }
  else{
    console.log("Error: "+error);
  }
})