import type { ParsedRequest, FileType, BlendTheme } from "../api/_lib/types";
const { H, R, copee } = window as any;
let timeout = -1;

interface ImagePreviewProps {
  src: string;
  onclick: () => void;
  onload: () => void;
  onerror: () => void;
  loading: boolean;
}

const ImagePreview = ({
  src,
  onclick,
  onload,
  onerror,
  loading,
}: ImagePreviewProps) => {
  const style = {
    filter: loading ? "blur(5px)" : "",
    opacity: loading ? 0.1 : 1,
  };
  const title = "Click to copy image URL to clipboard";
  return H(
    "a",
    { className: "image-wrapper", href: src, onclick },
    H("img", { src, onload, onerror, style, title })
  );
};

interface DropdownOption {
  text: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onchange: (val: string) => void;
  small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
  const wrapper = small ? "select-wrapper small" : "select-wrapper";
  const arrow = small ? "select-arrow small" : "select-arrow";
  return H(
    "div",
    { className: wrapper },
    H(
      "select",
      { onchange: (e: any) => onchange(e.target.value) },
      options.map((o) =>
        H("option", { value: o.value, selected: value === o.value }, o.text)
      )
    ),
    H("div", { className: arrow }, "▼")
  );
};

interface TextInputProps {
  value: string;
  oninput: (val: string) => void;
  small: boolean;
  placeholder?: string;
  type?: string;
}

const TextInput = ({
  value,
  oninput,
  small,
  type = "text",
  placeholder = "",
}: TextInputProps) => {
  return H(
    "div",
    { className: "input-outer-wrapper" + (small ? " small" : "") },
    H(
      "div",
      { className: "input-inner-wrapper" },
      H("input", {
        type,
        value,
        placeholder,
        oninput: (e: any) => oninput(e.target.value),
      })
    )
  );
};

interface FieldProps {
  label: string;
  input: any;
}

const Field = ({ label, input }: FieldProps) => {
  return H(
    "div",
    { className: "field" },
    H(
      "label",
      H("div", { className: "field-label" }, label),
      H("div", { className: "field-value" }, input)
    )
  );
};

interface ToastProps {
  show: boolean;
  message: string;
}

const Toast = ({ show, message }: ToastProps) => {
  const style = { transform: show ? "translate3d(0,-0px,-0px) scale(1)" : "" };
  return H(
    "div",
    { className: "toast-area" },
    H(
      "div",
      { className: "toast-outer", style },
      H(
        "div",
        { className: "toast-inner" },
        H("div", { className: "toast-message" }, message)
      )
    )
  );
};

const fileTypeOptions: DropdownOption[] = [
  { text: "PNG", value: "png" },
  { text: "JPEG", value: "jpeg" },
];

const blendThemeOptions: DropdownOption[] = [
  { text: "Blue", value: "blue" },
  { text: "Orange", value: "orange" },
  { text: "Rouge", value: "rouge" },
];

const teaserImagePlaceholder =
  "https://techhub.iodigital.com/iO-technology-blog1.png";

const authorImagePlaceholder =
  "https://techhub.iodigital.com/iO-technology-blog1.png";

interface AppState extends ParsedRequest {
  loading: boolean;
  showToast: boolean;
  messageToast: string;
  selectedImageIndex: number;
  widths: string[];
  heights: string[];
  overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
  const setLoadingState = (newState: Partial<AppState>) => {
    window.clearTimeout(timeout);
    if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
      newState.overrideUrl = state.overrideUrl;
    }
    if (newState.overrideUrl) {
      timeout = window.setTimeout(() => setState({ overrideUrl: null }), 200);
    }

    setState({ ...newState, loading: true });
  };
  const {
    fileType = "png",
    blendTheme = "blue",
    domain = "tech_hub",
    title = "A title with an _emphasized_ part",
    author = "Author Name",
    teaserImage = teaserImagePlaceholder,
    authorImage = authorImagePlaceholder,
    date = `${new Intl.DateTimeFormat("en").format(new Date())}`,
    showToast = false,
    messageToast = "",
    loading = true,
    overrideUrl = null,
  } = state;

  const url = new URL(window.location.origin);
  url.pathname = `${encodeURIComponent(title)}.${fileType}`;
  blendTheme?.length && url.searchParams.append("blendTheme", blendTheme);
  domain?.length && url.searchParams.append("domain", domain);
  teaserImage?.length && url.searchParams.append("teaserImage", teaserImage);
  author?.length && url.searchParams.append("author", author);
  authorImage?.length && url.searchParams.append("authorImage", authorImage);
  date?.length && url.searchParams.append("date", date);

  return H(
    "div",
    { className: "split" },
    H(
      "div",
      { className: "pull-left" },
      H(
        "div",
        H(Field, {
          label: "File Type",
          input: H(Dropdown, {
            options: fileTypeOptions,
            value: fileType,
            onchange: (val: FileType) => setLoadingState({ fileType: val }),
          }),
        }),
        H(Field, {
          label: "Blend theme",
          input: H(Dropdown, {
            options: blendThemeOptions,
            value: blendTheme,
            onchange: (val: BlendTheme) => setLoadingState({ blendTheme: val }),
          }),
        }),
        H(Field, {
          label: "Domain",
          input: H(TextInput, {
            value: domain,
            oninput: (val: string) => {
              console.log("oninput " + val);
              setLoadingState({ domain: val, overrideUrl: url });
            },
          }),
        }),
        H(Field, {
          label: "Title",
          input: H(TextInput, {
            value: title,
            oninput: (val: string) => {
              console.log("oninput " + val);
              setLoadingState({ title: val, overrideUrl: url });
            },
          }),
        }),
        H(Field, {
          label: "Teaser Image",
          input: H(
            "div",
            H(TextInput, {
              value: teaserImage,
              oninput: (value: string) => {
                setLoadingState({
                  teaserImage: value,
                  overrideUrl: url,
                });
              },
            })
          ),
        }),
        H(Field, {
          label: "Author Name",
          input: H(TextInput, {
            value: author,
            oninput: (val: string) => {
              console.log("oninput " + val);
              setLoadingState({ author: val, overrideUrl: url });
            },
          }),
        }),
        H(Field, {
          label: "Author Image",
          input: H(
            "div",
            H(TextInput, {
              value: authorImage,
              oninput: (value: string) => {
                setLoadingState({
                  authorImage: value,
                  overrideUrl: url,
                });
              },
            })
          ),
        }),
        H(Field, {
          label: "Date",
          input: H(TextInput, {
            value: date,
            oninput: (val: string) => {
              console.log("oninput " + val);
              setLoadingState({ date: val, overrideUrl: url });
            },
          }),
        })
      )
    ),
    H(
      "div",
      { className: "pull-right" },
      H(ImagePreview, {
        src: overrideUrl ? overrideUrl.href : url.href,
        loading: loading,
        onload: () => setState({ loading: false }),
        onerror: () => {
          setState({
            showToast: true,
            messageToast: "Oops, an error occurred",
          });
          setTimeout(() => setState({ showToast: false }), 2000);
        },
        onclick: (e: Event) => {
          e.preventDefault();
          const success = copee.toClipboard(url.href);
          if (success) {
            setState({
              showToast: true,
              messageToast: "Copied image URL to clipboard",
            });
            setTimeout(() => setState({ showToast: false }), 3000);
          } else {
            window.open(url.href, "_blank");
          }
          return false;
        },
      })
    ),
    H(Toast, {
      message: messageToast,
      show: showToast,
    })
  );
};

R(H(App), document.getElementById("app"));
