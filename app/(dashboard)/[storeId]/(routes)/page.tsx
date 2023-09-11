import prismadb from "@/lib/prismadb";

type DashboardPageProps = {
  params: {
    storeId: string;
  };
};

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>{store?.name}</div>;
};

export default DashboardPage;
