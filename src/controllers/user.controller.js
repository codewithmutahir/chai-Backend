import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user data from fronted ✅
  // 2. validation - not empty ✅
  // 3. check if user already exists: username , email ✅
  // 4. check for images , check for avatar ✅
  // 5. upload them to cloudinary, avatar check , and get URL ✅
  // 6. create user object - create entry in db ✅
  // 7. remove password and refresh token in field from response ✅
  // 8. check for user creation ✅
  // 9. return response ✅

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const findCreatedUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!findCreatedUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, findCreatedUser, "User created successfully"));
});

export { registerUser };
