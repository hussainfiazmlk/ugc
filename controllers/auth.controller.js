const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
  packageService,
  uploadService,
} = require("../services");

const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();

const register = catchAsync(async (req, res) => {
  if (!req.files) {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmailBuyer(
        user.email,
        user,
        verifyEmailToken
      );
      

    res.status(httpStatus.CREATED).send({ user, tokens });
    return;
  }

  //1. Upload the profile picture to Firebase Storage
  const { profilePicture } = req.files;

  
  const [file] = profilePicture;
  
  
  const storageRef = ref(storage, `files/${file.originalname}`);

  const metadata = {
    contentType: file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metadata
  );

  const downloadURL = await getDownloadURL(snapshot.ref);


  //2. Upload video content to user profile
  const { video1, video2, video3, video4 } = req.files;

  let videoUrl1;
  let videoUrl2;
  let videoUrl3;
  let videoUrl4;

  if (video1) {
    const [videoFile1] = video1;

    const storageRef = ref(storage, `files/${videoFile1.originalname}`);

    const metadata = {
      contentType: videoFile1.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      videoFile1.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    videoUrl1 = downloadURL;
  }

  if (video2) {
    const [videoFile2] = video2;

    const storageRef = ref(storage, `files/${videoFile2.originalname}`);

    const metadata = {
      contentType: videoFile2.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      videoFile2.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    videoUrl2 = downloadURL;
  }

  if (video3) {
    const [videoFile3] = video3;

    const storageRef = ref(storage, `files/${videoFile3.originalname}`);

    const metadata = {
      contentType: videoFile3.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      videoFile3.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    videoUrl3 = downloadURL;
  }

  if (video4) {
    const [videoFile4] = video4;

    const storageRef = ref(storage, `files/${videoFile4.originalname}`);

    const metadata = {
      contentType: videoFile4.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      videoFile4.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    videoUrl4 = downloadURL;
  }

  let { niches, languages } = req.body
  if (niches) {
    niches = JSON.parse(niches?.replace(/'/g, '"'));
  }

  if (languages) {
    languages = JSON.parse(languages?.replace(/'/g, '"'))
  }

  const newUser = {
    ...req.body,
    profilePicture: downloadURL,
    role: req?.body?.role || "creator",
    niches: niches ? niches : null,
    languages: languages ? languages : null,
    video1: videoUrl1 ? videoUrl1 : null,
    video2: videoUrl2 ? videoUrl2 : null,
    video3: videoUrl3 ? videoUrl3 : null,
    video4: videoUrl4 ? videoUrl4 : null,
  };

  const user = await userService.createUser(newUser);

  const { packages } = req.body;

  // const parsedPackages = JSON.parse(packages);

  // parsedPackages.packages.map(async (parsedPackage) => {
  //   parsedPackage.packs.map(async (pack) => {
  //     const newPackage = {
  //       ...pack,
  //       niche: parsedPackage.name.toLowerCase(),
  //       userId: user.id,
  //     };

  //     await packageService.createPackage(newPackage);
  //   });
  // });

  const tokens = await tokenService.generateAuthTokens(user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmailBuyer(
    user.email,
    user,
    verifyEmailToken
  );


  
  console.log('user token====', user, tokens);


  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.send({ message: "Logged out" });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.json({ status: "success" });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.json({ status: "success" });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
