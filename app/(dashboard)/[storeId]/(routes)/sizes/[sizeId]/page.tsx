import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/SizeForm";

const SizePage = async ({
  params,
}: {
  params: {
    sizeId: string;
  };
}) => {
  const size =
    params.sizeId !== "new"
      ? await prismadb.size.findUnique({
          where: {
            id: params.sizeId,
          },
        })
      : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
