import { WrongRequestException } from '../exceptions';

export const FileFilter =
  (extension, errorMessage) =>
  (req, file, callback): void => {
    const matcher = `\\.(${extension})$`;
    const re = new RegExp(matcher);
    if (!file.originalname.match(re)) {
      return callback(new WrongRequestException(errorMessage), false);
    }
    callback(null, true);
  };
