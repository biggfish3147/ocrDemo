/**
 * 屏幕分辨率1080x1920
 * 横纵比9：16
 * 扫描框组件坐标（90，330），（990，630）
 *
 * 基于特定组件位置进行测试，大致估算扫描框内容相对于图片的坐标信息
 *
 * 传入参数为图片分辨率的height。750x1000尺寸，则值为1000。
 *
 * 补充：仔细想来，扫描框组件相对屏幕位置是固定的。那么扫描框底下内容相对图片（尺寸与屏幕不一）的位置也应该相对固定。
 * 720x960尺寸测试，组件的宽度系数为0.7更合适（精准）
 */

export function getTrueCoordinate(height) {
  var height = height;
  var width = (3 / 4) * height; //拍摄图片默认3：4比例

  var x = height / 10 + (width - height / 5) / 15;
  var y = 0.16 * height;
  var conponentWidth = 0.8 * width;
  var conponentHeight = 0.15 * height;

  var coordinate = [x, y, conponentWidth + x, conponentHeight + y];

  return coordinate;
}
