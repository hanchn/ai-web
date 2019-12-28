const fs = require("fs");

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

/**
 * resultDir 获取当前目录结构
 *   { path} 参数一
 *
 *     path 为文件创建的目录 如果不传递则默认为当前目录
 *
 *   fs 参数二 nodejs 原生文件流模块 如果不传递 则惰性创建 效率变差
 */

const resultDir = ({ path = "" }, fs_) => {
  const path_ = path == "" ? __dirname : __dirname + path;
  let fileXML = [];
  for (let [key, item] of Object.entries(fs.readdirSync(path_))) {
    const fileName = item.split(".").shift();
    const extension = item.split(".").length > 1 ? item.split(".").pop() : "";
    fileXML = [
      ...fileXML,
      {
        fileName,
        extension,
        children: extension
          ? []
          : resultDir({ path: path + "\\" + fileName }, fs_)
      }
    ];
  }
  return fileXML;
};

/**
 * getDirPath 获取当前目录地址
 *  { fileName = "", extension = "", fileXML = [] } 参数一
 *
 *     fileName 为文件名
 *     extension 为拓展名
 *     fileXML 当前的文件结构
 */

const getDirPath = ({ fileName = "", extension = "", fileXML = [] }) => {
  if (fileXML.length < 1) return false;
  let dir = "";
  for (let [key, item] of Object.entries(fileXML)) {
    dir = item.fileName + (item.extension == "" ? "" : "." + item.extension);
    if (item.fileName == fileName && item.extension == extension) {
      return dir;
    } else if (item.children && item.children.length > 0) {
      const childDir = getDirPath({
        fileName,
        extension,
        fileXML: item.children
      });
      if (childDir) {
        return dir + "\\" + childDir;
      }
    }
  }
  return false;
};

const readFileContext = ({ path = "", encoding = "utf-8" }, fs_) =>
  fs_.readFileSync(__dirname + "\\" + path, encoding);

const writeFileContext = ({ path = "", context = ["Hello World !"] }, fs_) =>
  fs_.writeFileSync(__dirname + "\\" + path, context);

writeFileContext({ path: "test.html", context: ["Hello World !"] }, fs);

module.exports = {
  handleMk,
  makeFiles,
  resultDir,
  readFileContext,
  writeFileContext
};
