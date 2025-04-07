import dbConnect from '@/lib/bdConnect';
import UserModel from '@/model/User';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return Response.json(
      { message: 'Username is required', success: false },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { 
        success: true, 
        isAcceptingMessages: user.isAcceptingMessages 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking user status:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
} 