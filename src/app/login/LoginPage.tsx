'use client';

// import HtmlWrapper from "@/components/dev/html-wrapper/HtmlWrapper";
// import Iframe from "@/components/dev/Iframe";
// import MainWrapper from '@/components/dev/MainWrapper';
// import CarouselDiscover from "@/components/prod/carousels/CarouselDiscover";
// import Markdown from "@/components/dev/markdown/about.mdx";
// import ArrowSvg from "@/components/prod/decorations/ArrowSvgOld";
// import EmailDialogueBlackFriday from "@/components/prod/forms/EmailDialogueBlackFriday";
// import PaperForm from "@/components/prod/forms/PaperForm";
// import Recipe from "@/components/prod/recipes/Recipe";

export default function Homepage() {
    // const element = null; //<CarouselDiscover />;
    return (
        <>
            <h1
                data-testid="hero-heading"
                className="text-black dark:text-white text-4xl mx-auto"
            >
                Welcome to Dev 2.0
            </h1>
            <p className="text-black dark:text-white text-2xl mx-auto">
                Please use the button above to log in!
            </p>
            {/* <div className=" text-grey6F dark:text-white bg-white mx-auto max-w-[67.5rem] py-16 px-10">
         <Markdown /> 
      </div> */}
            {/* <Iframe/> */}
            {/* <HtmlWrapper>{element}</HtmlWrapper>  */}
            {/* {element ? element : null} */}
        </>
    );
}
