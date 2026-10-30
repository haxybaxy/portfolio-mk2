import CopiedToast from "../components/CopiedToast";
import { EMAIL } from "../contact";
import { useCopyEmail } from "../hooks/useCopyEmail";
import { LINK, SECTION_TITLE } from "../surface";

/** The address written out with [at], copied to the clipboard on click */
function CopyEmailText() {
  const { copied, copy } = useCopyEmail();

  return (
    <>
      <CopiedToast visible={copied} />
      <button
        type="button"
        onClick={copy}
        title={copied ? "Copied!" : "Copy email"}
        className={`cursor-pointer self-start text-lg font-bold md:text-xl ${LINK}`}
      >
        {EMAIL.replace("@", "[at]")}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </>
  );
}

function Contact() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <h2 className={SECTION_TITLE}>Contact</h2>

      <div className="flex flex-col gap-5">
        <p className="text-2xl font-bold tracking-tight md:text-3xl">
          Want to work together?
        </p>
        <p className="leading-relaxed opacity-80">
          If you need someone who can make things happen at any given moment,
          <br />
          send me an email at my business address.
        </p>
        <CopyEmailText />
      </div>
    </div>
  );
}

export default Contact;
