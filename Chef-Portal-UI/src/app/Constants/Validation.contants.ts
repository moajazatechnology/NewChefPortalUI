export class ValidationConstants {
    public static EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    public static PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]/;
    public static ONLY_CHARCTER = /^[a-zA-Z]+$/;
    public static FILE_NAME = /^[a-zA-Z0-9_-]*$/;
    public static NUMBER_ONLY = /^[0-9]+$/;
    public static CHARCTER_SPACE = /^[a-zA-Z_-]*$/;
}
