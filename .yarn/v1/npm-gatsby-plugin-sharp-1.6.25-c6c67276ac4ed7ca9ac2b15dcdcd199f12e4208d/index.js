"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var notMemoizedbase64 = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref3) {
    var file = _ref3.file,
        _ref3$args = _ref3.args,
        args = _ref3$args === undefined ? {} : _ref3$args;

    var defaultArgs, options, pipeline, _ref5, buffer, info, originalName;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            defaultArgs = {
              width: 20,
              quality: 50,
              jpegProgressive: true,
              pngCompressionLevel: 9,
              grayscale: false,
              duotone: false,
              toFormat: ``
            };
            options = _.defaults(args, defaultArgs);
            pipeline = sharp(file.absolutePath).rotate();


            pipeline.resize(options.width, options.height).crop(options.cropFocus).png({
              compressionLevel: options.pngCompressionLevel,
              adaptiveFiltering: false,
              force: args.toFormat === `png`
            }).jpeg({
              quality: options.quality,
              progressive: options.jpegProgressive,
              force: args.toFormat === `jpg`
            });

            // grayscale
            if (options.grayscale) {
              pipeline = pipeline.grayscale();
            }

            // rotate
            if (options.rotate && options.rotate !== 0) {
              pipeline = pipeline.rotate(options.rotate);
            }

            // duotone

            if (!options.duotone) {
              _context2.next = 10;
              break;
            }

            _context2.next = 9;
            return duotone(options.duotone, file.extension, pipeline);

          case 9:
            pipeline = _context2.sent;

          case 10:
            _context2.next = 12;
            return pipeline.toBufferAsync();

          case 12:
            _ref5 = _context2.sent;
            buffer = _ref5[0];
            info = _ref5[1];
            originalName = file.base;
            return _context2.abrupt("return", {
              src: `data:image/${info.format};base64,${buffer.toString(`base64`)}`,
              width: info.width,
              height: info.height,
              aspectRatio: info.width / info.height,
              originalName: originalName
            });

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function notMemoizedbase64(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var base64 = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(args) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return memoizedBase64(args);

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function base64(_x3) {
    return _ref7.apply(this, arguments);
  };
}();

var responsiveSizes = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(_ref8) {
    var file = _ref8.file,
        _ref8$args = _ref8.args,
        args = _ref8$args === undefined ? {} : _ref8$args;

    var defaultArgs, options, _ref10, width, height, density, pixelRatio, presentationWidth, presentationHeight, sizes, filteredSizes, sortedSizes, images, base64Width, base64Height, base64Args, base64Image, originalImg, fallbackSrc, srcSet, originalName;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            defaultArgs = {
              maxWidth: 800,
              quality: 50,
              jpegProgressive: true,
              pngCompressionLevel: 9,
              grayscale: false,
              duotone: false,
              pathPrefix: ``,
              toFormat: ``,
              sizeByPixelDensity: false
            };
            options = _.defaults({}, args, defaultArgs);

            options.maxWidth = parseInt(options.maxWidth, 10);

            // Account for images with a high pixel density. We assume that these types of
            // images are intended to be displayed at their native resolution.
            _context4.next = 5;
            return sharp(file.absolutePath).metadata();

          case 5:
            _ref10 = _context4.sent;
            width = _ref10.width;
            height = _ref10.height;
            density = _ref10.density;
            pixelRatio = options.sizeByPixelDensity && typeof density === `number` && density > 0 ? density / 72 : 1;
            presentationWidth = Math.min(options.maxWidth, Math.round(width / pixelRatio));
            presentationHeight = Math.round(presentationWidth * (height / width));

            // If the users didn't set a default sizes, we'll make one.

            if (!options.sizes) {
              options.sizes = `(max-width: ${presentationWidth}px) 100vw, ${presentationWidth}px`;
            }

            // Create sizes (in width) for the image. If the max width of the container
            // for the rendered markdown file is 800px, the sizes would then be: 200,
            // 400, 800, 1200, 1600, 2400.
            //
            // This is enough sizes to provide close to the optimal image size for every
            // device size / screen resolution while (hopefully) not requiring too much
            // image processing time (Sharp has optimizations thankfully for creating
            // multiple sizes of the same input file)
            sizes = [];

            sizes.push(options.maxWidth / 4);
            sizes.push(options.maxWidth / 2);
            sizes.push(options.maxWidth);
            sizes.push(options.maxWidth * 1.5);
            sizes.push(options.maxWidth * 2);
            sizes.push(options.maxWidth * 3);
            filteredSizes = sizes.filter(function (size) {
              return size < width;
            });

            // Add the original image to ensure the largest image possible
            // is available for small images. Also so we can link to
            // the original image.

            filteredSizes.push(width);

            // Sort sizes for prettiness.
            sortedSizes = _.sortBy(filteredSizes);

            // Queue sizes for processing.

            images = sortedSizes.map(function (size) {
              var arrrgs = (0, _extends3.default)({}, options, {
                width: Math.round(size)
                // Queue sizes for processing.
              });if (options.maxHeight) {
                arrrgs.height = Math.round(size * (options.maxHeight / options.maxWidth));
              }

              return queueImageResizing({
                file,
                args: arrrgs // matey
              });
            });
            base64Width = 20;
            base64Height = Math.max(1, Math.round(base64Width * height / width));
            base64Args = {
              duotone: options.duotone,
              grayscale: options.grayscale,
              rotate: options.rotate,
              width: base64Width,
              height: base64Height

              // Get base64 version
            };
            _context4.next = 29;
            return base64({ file, args: base64Args });

          case 29:
            base64Image = _context4.sent;


            // Construct src and srcSet strings.
            originalImg = _.maxBy(images, function (image) {
              return image.width;
            }).src;
            fallbackSrc = _.minBy(images, function (image) {
              return Math.abs(options.maxWidth - image.width);
            }).src;
            srcSet = images.map(function (image) {
              return `${image.src} ${Math.round(image.width)}w`;
            }).join(`,\n`);
            originalName = file.base;
            return _context4.abrupt("return", {
              base64: base64Image.src,
              aspectRatio: images[0].aspectRatio,
              src: fallbackSrc,
              srcSet,
              sizes: options.sizes,
              originalImg: originalImg,
              originalName: originalName,
              density,
              presentationWidth,
              presentationHeight
            });

          case 35:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function responsiveSizes(_x4) {
    return _ref9.apply(this, arguments);
  };
}();

var resolutions = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(_ref11) {
    var file = _ref11.file,
        _ref11$args = _ref11.args,
        args = _ref11$args === undefined ? {} : _ref11$args;
    var defaultArgs, options, sizes, dimensions, filteredSizes, sortedSizes, images, base64Args, base64Image, fallbackSrc, srcSet, originalName;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            defaultArgs = {
              width: 400,
              quality: 50,
              jpegProgressive: true,
              pngCompressionLevel: 9,
              grayscale: false,
              duotone: false,
              pathPrefix: ``,
              toFormat: ``
            };
            options = _.defaults({}, args, defaultArgs);

            options.width = parseInt(options.width, 10);

            // Create sizes for different resolutions — we do 1x, 1.5x, 2x, and 3x.
            sizes = [];

            sizes.push(options.width);
            sizes.push(options.width * 1.5);
            sizes.push(options.width * 2);
            sizes.push(options.width * 3);
            dimensions = imageSize(file.absolutePath);
            filteredSizes = sizes.filter(function (size) {
              return size <= dimensions.width;
            });

            // If there's no sizes after filtering (e.g. image is smaller than what's
            // requested, add back the original so there's at least something)

            if (filteredSizes.length === 0) {
              filteredSizes.push(dimensions.width);
              console.warn(`
                 The requested width "${options.width}px" for a resolutions field for
                 the file ${file.absolutePath}
                 was wider than the actual image width of ${dimensions.width}px!
                 If possible, replace the current image with a larger one.
                 `);
            }

            // Sort sizes for prettiness.
            sortedSizes = _.sortBy(filteredSizes);
            images = sortedSizes.map(function (size) {
              var arrrgs = (0, _extends3.default)({}, options, {
                width: Math.round(size)
                // Queue sizes for processing.
              });if (options.height) {
                arrrgs.height = Math.round(size * (options.height / options.width));
              }

              return queueImageResizing({
                file,
                args: arrrgs
              });
            });
            base64Args = {
              duotone: options.duotone,
              grayscale: options.grayscale,
              rotate: options.rotate

              // Get base64 version
            };
            _context5.next = 16;
            return base64({ file, args: base64Args });

          case 16:
            base64Image = _context5.sent;
            fallbackSrc = images[0].src;
            srcSet = images.map(function (image, i) {
              var resolution = void 0;
              switch (i) {
                case 0:
                  resolution = `1x`;
                  break;
                case 1:
                  resolution = `1.5x`;
                  break;
                case 2:
                  resolution = `2x`;
                  break;
                case 3:
                  resolution = `3x`;
                  break;
                default:
              }
              return `${image.src} ${resolution}`;
            }).join(`,\n`);
            originalName = file.base;
            return _context5.abrupt("return", {
              base64: base64Image.src,
              aspectRatio: images[0].aspectRatio,
              width: images[0].width,
              height: images[0].height,
              src: fallbackSrc,
              srcSet,
              originalName: originalName
            });

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function resolutions(_x5) {
    return _ref12.apply(this, arguments);
  };
}();

var notMemoizedtraceSVG = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(_ref13) {
    var file = _ref13.file,
        args = _ref13.args,
        fileArgs = _ref13.fileArgs;
    var potrace, trace, defaultArgs, optionsSVG, defaultFileResizeArgs, options, pipeline, tmpDir, tmpFilePath;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            potrace = require(`potrace`);
            trace = Promise.promisify(potrace.trace);
            defaultArgs = {
              color: `lightgray`,
              optTolerance: 0.4,
              turdSize: 100,
              turnPolicy: potrace.Potrace.TURNPOLICY_MAJORITY
            };
            optionsSVG = _.defaults(args, defaultArgs);
            defaultFileResizeArgs = {
              width: 400,
              quality: 50,
              jpegProgressive: true,
              pngCompressionLevel: 9,
              grayscale: false,
              duotone: false,
              toFormat: ``
            };
            options = _.defaults(fileArgs, defaultFileResizeArgs);
            pipeline = sharp(file.absolutePath).rotate();


            pipeline.resize(options.width, options.height).crop(options.cropFocus).png({
              compressionLevel: options.pngCompressionLevel,
              adaptiveFiltering: false,
              force: args.toFormat === `png`
            }).jpeg({
              quality: options.quality,
              progressive: options.jpegProgressive,
              force: args.toFormat === `jpg`
            });

            // grayscale
            if (options.grayscale) {
              pipeline = pipeline.grayscale();
            }

            // rotate
            if (options.rotate && options.rotate !== 0) {
              pipeline = pipeline.rotate(options.rotate);
            }

            // duotone

            if (!options.duotone) {
              _context6.next = 14;
              break;
            }

            _context6.next = 13;
            return duotone(options.duotone, file.extension, pipeline);

          case 13:
            pipeline = _context6.sent;

          case 14:
            tmpDir = require(`os`).tmpdir();
            tmpFilePath = `${tmpDir}/${file.internal.contentDigest}-${file.name}-${crypto.createHash(`md5`).update(JSON.stringify(fileArgs)).digest(`hex`)}.${file.extension}`;
            _context6.next = 18;
            return new Promise(function (resolve) {
              return pipeline.toFile(tmpFilePath, function (err, info) {
                resolve();
              });
            });

          case 18:
            return _context6.abrupt("return", trace(tmpFilePath, optionsSVG).then(function (svg) {
              return optimize(svg);
            }).then(function (svg) {
              return encodeOptimizedSVGDataUri(svg);
            }));

          case 19:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function notMemoizedtraceSVG(_x6) {
    return _ref14.apply(this, arguments);
  };
}();

var traceSVG = function () {
  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(args) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return memoizedTraceSVG(args);

          case 2:
            return _context7.abrupt("return", _context7.sent);

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function traceSVG(_x7) {
    return _ref16.apply(this, arguments);
  };
}();

// https://codepen.io/tigt/post/optimizing-svgs-in-data-uris


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sharp = require(`sharp`);
var crypto = require(`crypto`);
var imageSize = require(`image-size`);
var _ = require(`lodash`);
var Promise = require(`bluebird`);
var fs = require(`fs`);
var ProgressBar = require(`progress`);
var imagemin = require(`imagemin`);
var imageminPngquant = require(`imagemin-pngquant`);
var imageminWebp = require(`imagemin-webp`);
var queue = require(`async/queue`);
var path = require(`path`);

var duotone = require(`./duotone`);

var _require = require(`gatsby/dist/redux/actions`),
    boundActionCreators = _require.boundActionCreators;

// Promisify the sharp prototype (methods) to promisify the alternative (for
// raw) callback-accepting toBuffer(...) method


Promise.promisifyAll(sharp.prototype, { multiArgs: true });

// Try to enable the use of SIMD instructions. Seems to provide a smallish
// speedup on resizing heavy loads (~10%). Sharp disables this feature by
// default as there's been problems with segfaulting in the past but we'll be
// adventurous and see what happens with it on.
sharp.simd(true);

var bar = new ProgressBar(`Generating image thumbnails [:bar] :current/:total :elapsed secs :percent`, {
  total: 0,
  width: 30
});

var totalJobs = 0;
var processFile = function processFile(file, jobs, cb) {
  // console.log("totalJobs", totalJobs)
  bar.total = totalJobs;

  var imagesFinished = 0;

  // Wait for each job promise to resolve.
  Promise.all(jobs.map(function (job) {
    return job.finishedPromise;
  })).then(function () {
    return cb();
  });

  var pipeline = sharp(file).rotate();
  jobs.forEach(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(job) {
      var args, clonedPipeline, roundedHeight, roundedWidth;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              args = job.args;
              clonedPipeline = void 0;

              if (jobs.length > 1) {
                clonedPipeline = pipeline.clone();
              } else {
                clonedPipeline = pipeline;
              }
              // Sharp only allows ints as height/width. Since height isn't always
              // set, check first before trying to round it.
              roundedHeight = args.height;

              if (roundedHeight) {
                roundedHeight = Math.round(roundedHeight);
              }
              roundedWidth = Math.round(args.width);

              clonedPipeline.resize(roundedWidth, roundedHeight).crop(args.cropFocus).png({
                compressionLevel: args.pngCompressionLevel,
                adaptiveFiltering: false,
                force: args.toFormat === `png`
              }).jpeg({
                quality: args.quality,
                progressive: args.jpegProgressive,
                force: args.toFormat === `jpg`
              }).webp({
                quality: args.quality,
                force: args.toFormat === `webp`
              });

              // grayscale
              if (args.grayscale) {
                clonedPipeline = clonedPipeline.grayscale();
              }

              // rotate
              if (args.rotate && args.rotate !== 0) {
                clonedPipeline = clonedPipeline.rotate(args.rotate);
              }

              // duotone

              if (!args.duotone) {
                _context.next = 13;
                break;
              }

              _context.next = 12;
              return duotone(args.duotone, job.file.extension, clonedPipeline);

            case 12:
              clonedPipeline = _context.sent;

            case 13:

              if (job.file.extension.match(/^jp/) && args.toFormat === `` || args.toFormat === `jpg`) {
                clonedPipeline.toFile(job.outputPath, function (err, info) {
                  imagesFinished += 1;
                  bar.tick();
                  boundActionCreators.setJob({
                    id: `processing image ${job.file.absolutePath}`,
                    imagesFinished
                  }, { name: `gatsby-plugin-sharp` });
                  job.outsideResolve(info);
                });
                // Compress pngs
              } else if (job.file.extension === `png` && args.toFormat === `` || args.toFormat === `png`) {
                clonedPipeline.toBuffer().then(function (sharpBuffer) {
                  imagemin.buffer(sharpBuffer, {
                    plugins: [imageminPngquant({
                      quality: `${args.quality}-${Math.min(args.quality + 25, 100)}` // e.g. 40-65
                    })]
                  }).then(function (imageminBuffer) {
                    fs.writeFile(job.outputPath, imageminBuffer, function () {
                      imagesFinished += 1;
                      bar.tick();
                      boundActionCreators.setJob({
                        id: `processing image ${job.file.absolutePath}`,
                        imagesFinished
                      }, { name: `gatsby-plugin-sharp` });
                      job.outsideResolve();
                    });
                  });
                });
                // Compress webp
              } else if (job.file.extension === `webp` && args.toFormat === `` || args.toFormat === `webp`) {
                clonedPipeline.toBuffer().then(function (sharpBuffer) {
                  imagemin.buffer(sharpBuffer, {
                    plugins: [imageminWebp({ quality: args.quality })]
                  }).then(function (imageminBuffer) {
                    fs.writeFile(job.outputPath, imageminBuffer, function () {
                      imagesFinished += 1;
                      bar.tick();
                      boundActionCreators.setJob({
                        id: `processing image ${job.file.absolutePath}`,
                        imagesFinished
                      }, { name: `gatsby-plugin-sharp` });
                      job.outsideResolve();
                    });
                  });
                });
              }

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

var toProcess = {};
var q = queue(function (task, callback) {
  task(callback);
}, 1);

var queueJob = function queueJob(job) {
  var inputFileKey = job.file.absolutePath.replace(/\./g, `%2E`);
  var outputFileKey = job.outputPath.replace(/\./g, `%2E`);
  var jobPath = `${inputFileKey}.${outputFileKey}`;

  // Check if the job has already been queued. If it has, there's nothing
  // to do, return.
  if (_.has(toProcess, jobPath)) {
    return;
  }

  // Check if the output file already exists so we don't redo work.
  if (fs.existsSync(job.outputPath)) {
    return;
  }

  var notQueued = true;
  if (toProcess[inputFileKey]) {
    notQueued = false;
  }
  _.set(toProcess, jobPath, job);

  totalJobs += 1;

  if (notQueued) {
    q.push(function (cb) {
      var jobs = _.values(toProcess[inputFileKey]);
      // Delete the input key from the toProcess list so more jobs can be queued.
      delete toProcess[inputFileKey];
      boundActionCreators.createJob({
        id: `processing image ${job.file.absolutePath}`,
        imagesCount: _.values(toProcess[inputFileKey]).length
      }, { name: `gatsby-plugin-sharp` });
      // We're now processing the file's jobs.
      processFile(job.file.absolutePath, jobs, function () {
        boundActionCreators.endJob({
          id: `processing image ${job.file.absolutePath}`
        }, { name: `gatsby-plugin-sharp` });
        cb();
      });
    });
  }
};

function queueImageResizing(_ref2) {
  var file = _ref2.file,
      _ref2$args = _ref2.args,
      args = _ref2$args === undefined ? {} : _ref2$args;

  var defaultArgs = {
    width: 400,
    quality: 50,
    jpegProgressive: true,
    pngCompressionLevel: 9,
    grayscale: false,
    duotone: false,
    pathPrefix: ``,
    toFormat: ``
  };
  var options = _.defaults(args, defaultArgs);
  // Filter out false args, and args not for this extension and put width at
  // end (for the file path)
  var pairedArgs = _.toPairs(args);
  var filteredArgs = void 0;
  // Remove non-true arguments
  filteredArgs = _.filter(pairedArgs, function (arg) {
    return arg[1];
  });
  // Remove pathPrefix
  filteredArgs = _.filter(filteredArgs, function (arg) {
    return arg[0] !== `pathPrefix`;
  });
  filteredArgs = _.filter(filteredArgs, function (arg) {
    if (file.extension.match(/^jp*/)) {
      return !_.includes(arg[0], `png`);
    } else if (file.extension.match(/^png/)) {
      return !arg[0].match(/^jp*/);
    }
    return true;
  });
  var sortedArgs = _.sortBy(filteredArgs, function (arg) {
    return arg[0] === `width`;
  });
  var fileExtension = options.toFormat ? options.toFormat : file.extension;

  var argsDigest = crypto.createHash(`md5`).update(JSON.stringify(sortedArgs)).digest(`hex`);

  var argsDigestShort = argsDigest.substr(argsDigest.length - 5);

  var imgSrc = `/${file.name}-${file.internal.contentDigest}-${argsDigestShort}.${fileExtension}`;
  var filePath = path.join(process.cwd(), `public`, `static`, imgSrc);

  // Create function to call when the image is finished.
  var outsideResolve = void 0;
  var finishedPromise = new Promise(function (resolve) {
    outsideResolve = resolve;
  });

  var width = void 0;
  var height = void 0;
  // Calculate the eventual width/height of the image.
  var dimensions = imageSize(file.absolutePath);
  var aspectRatio = dimensions.width / dimensions.height;
  var originalName = file.base;

  // If the width/height are both set, we're cropping so just return
  // that.
  if (options.width && options.height) {
    width = options.width;
    height = options.height;
    // Recalculate the aspectRatio for the cropped photo
    aspectRatio = width / height;
  } else {
    // Use the aspect ratio of the image to calculate what will be the resulting
    // height.
    width = options.width;
    height = options.width / aspectRatio;
  }

  // Create job and process.
  var job = {
    file,
    args: options,
    finishedPromise,
    outsideResolve,
    inputPath: file.absolutePath,
    outputPath: filePath
  };

  queueJob(job);

  // Prefix the image src.
  var prefixedSrc = options.pathPrefix + `/static` + imgSrc;

  return {
    src: prefixedSrc,
    absolutePath: filePath,
    width,
    height,
    aspectRatio,
    finishedPromise,
    originalName: originalName
  };
}

var memoizedBase64 = _.memoize(notMemoizedbase64, function (_ref6) {
  var file = _ref6.file,
      args = _ref6.args;
  return `${file.id}${JSON.stringify(args)}`;
});

var memoizedTraceSVG = _.memoize(notMemoizedtraceSVG, function (_ref15) {
  var file = _ref15.file,
      args = _ref15.args;
  return `${file.absolutePath}${JSON.stringify(args)}`;
});

function encodeOptimizedSVGDataUri(svgString) {
  var uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
  .replace(/%0A/g, ``) // remove newlines
  .replace(/%20/g, ` `) // put spaces back in
  .replace(/%3D/g, `=`) // ditto equals signs
  .replace(/%3A/g, `:`) // ditto colons
  .replace(/%2F/g, `/`) // ditto slashes
  .replace(/%22/g, `'`); // replace quotes with apostrophes (may break certain SVGs)

  return `data:image/svg+xml,` + uriPayload;
}

var optimize = function optimize(svg) {
  var SVGO = require(`svgo`);
  var svgo = new SVGO({ multipass: true, floatPrecision: 1 });
  return new Promise(function (resolve, reject) {
    svgo.optimize(svg, function (_ref17) {
      var data = _ref17.data;
      return resolve(data);
    });
  });
};

exports.queueImageResizing = queueImageResizing;
exports.base64 = base64;
exports.traceSVG = traceSVG;
exports.responsiveSizes = responsiveSizes;
exports.responsiveResolution = resolutions;
exports.sizes = responsiveSizes;
exports.resolutions = resolutions;