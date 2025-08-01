import ShareIcon from "../icons/ShareIcon";

interface CardProps {
    title: string;
    tag: "youtube" | "twitter";
    link: string;
}

const Card = ({ title, tag, link }: CardProps) => {
    return (
        <div className="bg-white mt-10 rounded-xl shadow-md border border-gray-200 w-80 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h1 className="font-medium text-gray-800 text-sm">{title}</h1>
                <div className="text-gray-400">
                    <ShareIcon />
                </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">Shared Content</h2>

            <div className="w-full">
                {tag === "youtube" ? (
                    <iframe
                        className="w-full rounded-md"
                        height="200"
                        src={link}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <blockquote className="twitter-tweet">
                        <a href={link}></a>
                    </blockquote>
                )}
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
                <span className="bg-[#e6e9ed] text-[#7164c0] text-xs px-3 py-1 rounded-full font-medium">
                    #{tag}
                </span>
                <span className="bg-[#e6e9ed] text-[#7164c0] text-xs px-3 py-1 rounded-full font-medium">
                    #ideas
                </span>
            </div>

            <p className="text-[11px] text-gray-500 mt-2">Added on 10/03/2024</p>
        </div>
    );
};

export default Card;
