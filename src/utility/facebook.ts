import axios, { AxiosResponse, AxiosError } from 'axios';

interface FacebookDebugToken {
  data?: {
    type: string;
    is_valid: boolean;
    user_id: string;
  };
  error?: object;
}

export const validate = async (
  id: string,
  token: string,
  clientId: string,
  clientSecret: string,
) => {
  let result: boolean;
  const method = 'Validate Facebook token';
  await axios({
    url: 'https://graph.facebook.com/debug_token',
    params: {
      input_token: token,
      access_token: `${clientId}%${clientSecret}`,
    },
  })
    .then(({ data: { data, error } }: AxiosResponse<FacebookDebugToken>) => {
      result = true;
      if (data && data.is_valid && id == data.user_id) {
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
  return result;
};

export const getAllPost = async (token: string) => {
  let posts = {};
  const config = {
    method: 'get',
    url: 'https://graph.facebook.com/v15.0/me/posts',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      fields: 'id,message,created_time,from',
    },
  };

  await axios(config)
    .then((response: AxiosResponse) => {
      posts = response.data;
    })
    .catch((error: AxiosError) => {
      posts = error.response.data;
    });

  return posts;
};
