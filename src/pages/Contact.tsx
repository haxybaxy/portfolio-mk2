import CopiedToast from "../components/CopiedToast";
import SocialLinks from "../components/SocialLinks";
import { EMAIL } from "../contact";
import { useCopyEmail } from "../hooks/useCopyEmail";
import { LINK, MUTED, SECTION_TITLE } from "../surface";

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
        <p className="text-2xl font-bold tracking-tight md:text-3xl">Say hi.</p>
        <p className="leading-relaxed opacity-80">
          Work, collaborations, a strongly held opinion about tabs versus
          spaces: all of it goes to my business email. Click it to copy.
        </p>
        <CopyEmailText />
      </div>

      <div className="flex flex-col gap-3">
        <p className="opacity-80">
          I read everything and reply to most of it. The koi handles the rest.
        </p>
        <SocialLinks />
      </div>
    </div>
  );
}

export default Contact;
