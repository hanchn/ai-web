const fs = require("fs");
const path = require("path");
const createData = [
  {
    fileName: "test",
    extension: "",
    children: [
      {
        fileName: "index",
        extension: "html"
      },
      {
        fileName: "images"
      },
      {
        fileName: "css"
      }
    ]
  }
];

/**
 * handleMk 创建文件夹和文件
 *   { path, fileName, extension } 参数一
 *
 *     path 为文件创建的目录 如果不传递则默认为当前目录
 *     fileName 如果没有则默认随机创建
 *     extension 为文件扩展名，如果没有则直接创建文件夹
 *
 *   fs 参数二 nodejs 原生文件流模块 如果不传递 则惰性创建 效率变差
 */

const handleMk = ({ path = "", fileName = "", extension = "" }, fs_ = null) => {
  if (fileName == "") {
    console.error("文件名不能为空！");
    return false;
  }
  const fs = fs_ == null ? require("fs") : fs_;
  const isDir = extension == "" ? true : false;
  const reqPath =
    __dirname +
    path +
    "\\" +
    `${isDir ? fileName : fileName + "." + extension}`;
  const errorInfo = `${(isDir ? "文件夹 " : "文件 ") +
    fileName +
    (isDir ? "" : "." + extension)} 已经存在不可创建！`;
  fs.existsSync(reqPath)
    ? console.error(errorInfo)
    : isDir
    ? fs.mkdirSync(reqPath)
    : fs.writeFile(reqPath, "Hello World !");
};

/**
 * makeFiles 通过文件结构一键生成项目
 *   { path, fileXML } 参数一
 *
 *     path 为文件创建的目录 如果不传递则默认为当前目录
 *     fileXML 需要生成的项目结构
 *
 *   fs 参数二 nodejs 原生文件流模块 如果不传递 则惰性创建 效率变差
 */

const makeFiles = ({ path = "", fileXML = [] }, fs_) => {
  if (fileXML.length == 0) {
    console.error("无效创建，需要创建的目录结构为空！");
    return false;
  }

  for ([key, item] of Object.entries(fileXML)) {
    handleMk(Object.assign({ path }, fileXML[key]), fs_);
    if (fileXML[key]["children"] && fileXML[key]["children"].length > 0) {
      makeFiles(
        { path: "\\" + item.fileName, fileXML: fileXML[key]["children"] },
        fs_
      );
    }
  }
};

// makeFiles({ fileXML: createData }, fs);

module.exports = {
  handleMk,
  makeFiles
};
