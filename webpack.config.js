const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  mode: "development",
  entry: {
    main: ["babel-polyfill", "./src/index.js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    // '[name]'은 entry에 추가한 main이 문자열로 들어오는 방식이다.
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js 혹은 .jsx 확장자로 마치는 모든 파일
        exclude: /node_modules/, //  node_modules 폴더 내에 있는 파일은 제외한다.
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // .css 확장자로 마치는 모든 파일
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader // 프로덕션 환경
            : "style-loader",
          "css-loader",
        ], //개발 환경, css-loader가 먼저 적용되고 style-loader가 그 다음으로 적용된다.
      },
      {
        test: /\.png$/, // .png 확장자로 마치는 모든 파일
        loader: "file-loader",
        options: {
          publicPath: "./dist/", // prefix를 아웃풋 경로로 지정
          name: "[name].[ext]?[hash]", // 파일명 형식
        },
      },
      {
        test: /\.html$/, // .html 확장자로 마치는 모든 파일
        use: [
          {
            loader: "html-loader", // 웹팩이 html을 읽을 수 있게 해준다.
          },
        ],
      },
    ],
  },
  plugins: [
    // HTML 파일을 후처리하는 데 사용한다.
    new HtmlWebPackPlugin({
      template: "./public/index.html", // 템플릿 경로를 지정
      filename: "./index.html",
      // 배포 모드일 때는 파일을 압축하고 불필요한 주석을 제거한다.
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, // 빈칸 제거
              removeComments: true, // 주석 제거
            }
          : false,
    }),
    // 빌드 이전 결과물을 제거하는 플러그인이다.
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production" ? [new MiniCssExtractPlugin({ filename: `[name].css` })] : []),
  ],
  // 개발 서버 설정
  devServer: {
    // 콘텐츠를 제공할 경로 지정
    // contentBase: __dirname + "/dist/",
    // inline 모드 활성화
    inline: true,
    // webpack의 HMR 기능 활성화
    hot: true,
    // 사용될 호스트 지정
    host: "localhost",
    // 접속 포트 설정
    port: 3000,
    // open page when start
    open: true,
  },
}
