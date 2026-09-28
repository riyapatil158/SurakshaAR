import QRCode from "qrcode";

export async function renderQRToDataURL(text: string, size = 320): Promise<string> {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: { dark: "#0b0f16", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}

export async function renderQRToSVG(text: string, size = 256): Promise<string> {
  return QRCode.toString(text, { type: "svg", width: size, margin: 1 });
}
