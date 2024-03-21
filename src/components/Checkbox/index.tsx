import { Image } from "@tarojs/components";
import classNames from "classnames";

function CheckBox(props) {
  const { checked, borderColor = "#fff", onClick } = props;

  return (
    <div className="check-box" onClick={() => onClick(checked)}>
      <div className="check-border" style={{ borderColor: borderColor }}></div>
      <div className={classNames("check-status")}>
        {checked &&
          (borderColor === "#fff" ? (
            <Image
              className={"checked"}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAAXNSR0IArs4c6QAAAKJQTFRFAAAA////////////////////////////////////////AAAABAQECAgIDAwMEBAQGBgYHBwcHx8fICAgIyMjJycnKCgoNzc3Pz8/Q0NDR0dHS0tLT09PW1tbd3d3e3t7f39/g4ODh4eHi4uLl5eXr6+vs7Ozt7e3v7+/w8PDy8vLz8/P19fX29vb39/f4+Pj5+fn7+/v8/Pz9/f3+/v7////MUgh2gAAAAt0Uk5TAAgsLzCXm5+72/usAaWtAAABHklEQVQ4y43V23KCMBQF0IgCQgytWHvBWtt6SS9IFdn//2tNUqalQ0jOfspw1kPIZHYYUwnCJMVA0iQas5+MYngSj4ybwpupljEIiRmbgJSARTQYsoQGE5bSYMrcc3lftSs3lIKLHQEqx/mTHxpXNF74nimXn717NE6U8MFSO76HD5bX2m3Qh+Wl6yrjCvRgsxVFR1YL7fK6Dwv1/e7034kj+lDqyaLqOn6ABWKjR/PPjnuGFTYPephJ4HRr3Ap2iK+52de+dTf1EMTbzAhzLjw7YhDilf9FwgHx+Ote4ITnvHUruCE+hHHLiw9ip91VBS/EmvOZBAHWS9uP2O5juR64oPQCIFdKSIMRC2hwTC9SejWTy15lErmejzDQ5hs4Kh6817NvjQAAAABJRU5ErkJggg=="
            ></Image>
          ) : (
            <Image
              className={"checked"}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA8NJREFUWEfVmVtIFFEYx/+n3dINIVDcEiIlLIvKLNRNV9OHiF40CiJIWlsxulhRKApCIRSCECRWpri0dnlO1Fcf1FLb7aKRUl4etAveWou0XdNdT5yxlZ1dd2d29lbnbYbz/b/ffOf7vplzhsBptKhTdlGQSwA5RAjiAMid5/j52gqKUYC2E4J7OS+M7xz1if1Cnx0XHrW48QEIzvgZwDs5SnWmtVOXte2j88yQA2RwkdaNrQQ45J1aYGYToO2bfDKHQXKALerUBhBSGBh3ElUpGnO7DFrSmpG6l4L0SZQJqJl1ybaH/JPR+/vYlJI60qJWDYMgPqChkCpOMUJaMlSLQWglUhGtDJBKtfbFLlp1APF5GvRV3oRlYtytVEgAGVxKZRVk68JgW/iNgZpqjDU3rQoZdEBHODvRyNPH+FBfG3rA1eCmDD0wlpWA2myhBYxM3AvV7TuQK9avgJjHx9FRcBrWubnQ5uBqcCz3OrUazH0a81hrAc/BiC2xyNTpeZFjRK/KSzHxvFOwEQQUkMGl1dQiPCqKBzL0SI9BXb0gHPc1I9QHmRPzxDiWFhZECdonKTbFIKNO5wLHisJQck20lltAIpNh64mTSDh7Dqbet3hVXiYaksGl19RifUwMD4QVRXv+KdgsFt8BWcUpVWkrQt8H+rm8+T0z41HcHRwrinZNHsxfv4iG87jErGcduF3tEoHuKxfdvprcwTERY2kxJnu6vIITzMGEwnPYnq/liVqmpmAsK8bPkWHefU9wgw91GNLrvIYTBGR5yJY6OjmVJ241m/H6RjmmDS+5+2GRkVzORcSyPRZ/THa/4N4UUodgFYdHK7lqVCiVPB8sp95UXMePgX63cL++fEZHgcaronB+EEFAZhCVtB9p1TUgMtcd6LzJ5NJKmI3VYkaHVuN1UUgCZEbxeaex83yR6JV6WXwV08blFPBliIqg3UFyZRViMrME/X1sqMPw40bBeWImeAUoj4hA1sMnLg3Y0ZGvRSF5ie2GGxJ2QF1bz30NO4/ZsVF0FmhEv3H8HkG7YOzRY0gsKePpL87OchXraX8hBsjnCNoF9l2vwObDR7jLJZsVxtISvxSF3wBlCgUONui55uzPovAbIBNin2LbNFr03qqQsnqibP6Djfu/fvTRrE59QAg5LyrewZ5EqY48S0/eLV8jex9s32L8EdCkvweYKn3Ij36diSnV5XYZz/4fR8AMfvkQXXk35EfBFI2mtZMXeIfojtFtSk9JkhFSREGyg/Ubgi7/hmiz0aX7x7tf9zvy/AHfiI/r67ohtAAAAABJRU5ErkJggg=="
            ></Image>
          ))}
      </div>
      {props.children && <div className="children">{props.children}</div>}
    </div>
  );
}

export default CheckBox;
