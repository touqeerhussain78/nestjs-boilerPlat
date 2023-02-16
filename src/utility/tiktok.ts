import axios, { AxiosResponse, AxiosError } from 'axios';

export interface TiktokTokenData {
  access_token: string;
  open_id: string;
  refresh_token: string;
  scope: string;
}

interface TiktokAccessToken {
  data: TiktokTokenData;
  message: 'success' | 'error';
}

interface TiktokError {
  code: 'ok' | 'access_token_invalid';
}
interface TiktokBaseResponse<T> {
  data: T;
  error: TiktokError;
}

export type TiktokErrorData = TiktokBaseResponse<Record<string, never>>;

interface TiktokUser {
  user: {
    open_id: string;
    display_name: string;
    avatar_url: string;
  };
}
export type TiktokUserData = TiktokBaseResponse<TiktokUser>;

interface TiktokVideo {
  videos: {
    cover_image_url: string;
    id: string;
    title: string;
    video_description: string;
  }[];
  cursor: number;
  has_more: boolean;
}
type TiktokVideoData = TiktokBaseResponse<TiktokVideo>;

export interface TiktokResponse<T> {
  result: boolean;
  data: T | undefined;
}

type TiktokToken = TiktokResponse<TiktokTokenData>;

const checkScope = (data: TiktokTokenData, scope: string) => {
  if (scope && !data.scope.toLowerCase().includes(scope.toLowerCase())) {
    return;
  }
  return data;
};

let responseTiktokToken: TiktokToken = {
  result: false,
  data: undefined,
};
const repeatResponseData = (
  message: string,
  data: TiktokTokenData,
  method: string,
  scope: string,
) => {
  if (message == 'success') {
    const responseData = checkScope(data, scope);
    if (responseData) {
      responseTiktokToken = {
        result: true,
        data: responseData,
      };
    }
  } else {
    console.log({ method, data, message });
  }
};

export const validate = async (
  token: string,
  clientKey: string,
  clientSecret: string,
  scope = '',
) => {
  const method = 'Tiktok access token';
  await axios({
    method: 'post',
    url: 'https://open-api.tiktok.com/oauth/access_token',
    data: {
      client_key: clientKey,
      client_secret: clientSecret,
      code: token,
      grant_type: 'authorization_code',
    },
  })
    .then(({ data: { data, message } }: AxiosResponse<TiktokAccessToken>) => {
      repeatResponseData(message, data, method, scope);
    })
    .catch((error: AxiosError) => {
      console.log({ method, error });
    });
  return responseTiktokToken;
};

export const refresh = async (
  clientKey: string,
  refreshToken: string,
  scope = '',
) => {
  const method = 'Tiktok refresh token';
  await axios({
    method: 'post',
    url: 'https://open-api.tiktok.com/oauth/refresh_token/',
    data: {
      client_key: clientKey,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    },
  })
    .then(({ data: { data, message } }: AxiosResponse<TiktokAccessToken>) => {
      repeatResponseData(message, data, method, scope);
    })
    .catch((error: AxiosError) => {
      console.log({ method, error });
    });
  return responseTiktokToken;
};

export const user = async (token: string) => {
  let response: {
    id: string;
    name: string;
    token: string;
    profileImage: string;
  };
  let result: boolean;
  const method = 'Tiktok user info';
  await axios({
    url: 'https://open.tiktokapis.com/v2/user/info/',
    params: {
      fields: 'open_id,avatar_url,display_name',
    },
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(({ data: { data, error } }: AxiosResponse<TiktokUserData>) => {
      const { code } = error;
      if (code == 'ok') {
        const {
          user: { open_id: id, display_name: name, avatar_url: profileImage },
        } = data;
        response = { id, name, token, profileImage };
        result = true;
      } else {
        result = false;
        console.log({ method, data, error });
      }
    })
    .catch((error: AxiosError) => {
      result = false;
      console.log({ method, error });
    });
  return { result, data: response };
};

export const videoList = async (token: string, cursor: number) => {
  let result = false;
  let error: TiktokError;
  let response: TiktokVideo;
  const method = 'Tiktok video list';
  await axios({
    method: 'post',
    url: 'https://open.tiktokapis.com/v2/video/list/',
    params: {
      fields: 'id,video_description,title,cover_image_url',
    },
    data: {
      cursor,
    },
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(({ data: { data, error: err } }: AxiosResponse<TiktokVideoData>) => {
      const { code } = err;
      if (code == 'ok') {
        response = data;
        result = true;
      } else {
        console.log({ method, data, error: err });
        error = err;
      }
    })
    .catch((err: AxiosError<TiktokErrorData>) => {
      console.log({ method, error: err });
      if (err.response?.data?.error) {
        error = err.response.data.error;
      }
    });
  return { result, data: response, error };
};
