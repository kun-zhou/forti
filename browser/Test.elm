-- Read all about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/forms.html


port module Test exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Ports


port logPassword : String -> Cmd msg



-- MODEL


type alias Model =
    { name : String
    , password : String
    , passwordAgain : String
    }


init : ( Model, Cmd Msg )
init =
    ( Model "" "" "", Cmd.none )



-- UPDATE


type Msg
    = Name String
    | Password String
    | PasswordAgain String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Name name ->
            ( { model | name = name }, Cmd.none )

        Password password ->
            ( { model | password = password }, logPassword model.password )

        PasswordAgain password ->
            ( { model | passwordAgain = password }, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "yay Elm is working" ]
        , br [] []
        , input [ type_ "text", placeholder "Name", value model.password, onInput Name ] []
        , input [ type_ "password", placeholder "Password", onInput Password ] []
        , input [ type_ "password", placeholder "Re-enter Password", onInput PasswordAgain ] []
        , viewValidation model
        ]


viewValidation : Model -> Html msg
viewValidation model =
    let
        ( color, message ) =
            if model.password == model.passwordAgain then
                ( "green", "OK" )
            else
                ( "red", "Passwords do not match!" )
    in
        div [ style [ ( "color", color ) ] ] [ text message ]



--Subscriptions


port newInfo : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    newInfo Name
