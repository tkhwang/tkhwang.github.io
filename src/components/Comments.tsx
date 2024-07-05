import * as React from "react";
import Giscus from "@giscus/react";
import { SITE } from "@config";

const id = "inject-comments";

const Comments = () => {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState("dark");

  React.useEffect(() => {
    setMounted(true);
    const siteTheme = SITE.lightAndDarkMode;
    setTheme(siteTheme ? "dark" : "light");
  }, [SITE.lightAndDarkMode]);

  return (
    <div id={id}>
      {mounted ? (
        <Giscus
          id={id}
          repo="tkhwang/tkhwang.github.io"
          repoId="R_kgDOMDvpKQ"
          category="General"
          categoryId="DIC_kwDOMDvpKc4CgmZL"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          lang="en"
          loading="lazy"
          theme={theme} // Use dynamic theme
        />
      ) : null}
    </div>
  );
};

export default Comments;
