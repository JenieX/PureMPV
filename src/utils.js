// Copyright (c) 2022-2023 4ndrs <andres.degozaru@gmail.com>
// SPDX-License-Identifier: MIT

/* global mp */

export function copyToSelection(text, selection, copyUtility) {
  if (copyUtility !== "xclip" && copyUtility !== "wl-copy") {
    mp.msg.error(
      `ERROR: ${copyUtility} is not a known copy utility. ` +
        "Possible values are: xclip, wl-copy"
    );
    print("INFO: setting copy utility to 'xclip'");
    copyUtility = "xclip";
  }

  if (selection != "primary" && selection != "clipboard") {
    print(
      `ERROR: ${selection} is not a valid selection. ` +
        `Possible values are: primary, clipboard`
    );
    print("INFO: setting selection to 'primary'");
    selection = "primary";
  }

  let args;
  if (copyUtility === "xclip") {
    args = ["xclip", "-selection", selection];
  } else {
    args = ["wl-copy"];
    if (selection === "primary") {
      args = [...args, "--primary"];
    }
  }

  const { status } = mp.command_native({
    name: "subprocess",
    args,
    stdin_data: text,
    detach: true,
  });

  if (status === -3) {
    mp.msg.error(`Received status: ${status}`);
    printMessage(
      `Error occurred during the execution of ${copyUtility}. ` +
        `Please verify your ${copyUtility} installation.`
    );
    return;
  }

  printMessage(`Copied to ${selection}: ${text}`);
}

export function getCopyUtility() {
  const { status: xclipStatus } = mp.command_native({
    name: "subprocess",
    args: ["xclip", "-version"],
    detach: true,
    capture_stderr: true,
  });

  if (xclipStatus !== -3) {
    return "xclip";
  }

  const { status: wlCopyStatus } = mp.command_native({
    name: "subprocess",
    args: ["wl-copy", "--version"],
    detach: true,
    capture_stdout: true,
  });

  if (wlCopyStatus !== -3) {
    return "wl-copy";
  }

  throw new Error(
    "No xclip/wl-clipboard found installed. Copying will not work."
  );
}

export function getTimePosition() {
  // Returns the current timestamp in the format HH:MM:SS
  const timePos = mp.get_property("time-pos");
  return new Date(timePos * 1000).toISOString().substring(11, 23);
}

export function printMessage(message) {
  // Prints the message to both the OSD and the console
  mp.osd_message(message);
  print(message);
}
